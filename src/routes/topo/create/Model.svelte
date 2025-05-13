<script>
	import { T, useTask, useThrelte } from '@threlte/core';
	import { interactivity, MeshLineGeometry, MeshLineMaterial } from '@threlte/extras';
	import { ArrowHelper, Raycaster, Vector3 } from 'three';
	import { onMount } from 'svelte';
	import * as THREE from 'three';
	import CssObject from './CssObject.svelte';
	import { CSS2DRenderer } from 'three/examples/jsm/renderers/CSS2DRenderer.js';
	import { userState } from './state.svelte.js'; // onDestroy implicitly handled by onMount return in Svelte 5

	// Initialize interactivity system
	interactivity({ filter: (hits) => hits.slice(0, 1) });

	// --- Props ---
	let { gltfScene = null, element, ...props } = $props(); // Receive the scene as a prop
	$effect(() => {
		cssRenderer.setSize($size.width, $size.height)
	})

	// --- State for Line Drawing ---
	let allLinesData = $state([]);
	let currentClickData = $state([]);
	let currentLineSegments = $state([]);

	const { autoRenderTask, camera, scene, size } = useThrelte()
	// note that the renderer won't be reactive if `element` updates
	// you'd have to do `$derived(new CSS2DRenderer({element}))` if you'd want that to be the case
	const cssRenderer = new CSS2DRenderer({ element })
	$effect(() => {
		cssRenderer.setSize($size.width, $size.height)
	})
	// We are running two renderers, and don't want to run
	// updateMatrixWorld twice; tell the renderers that we'll handle
	// it manually.
	// https://threejs.org/docs/#api/en/core/Object3D.updateWorldMatrix
	const last = scene.matrixWorldAutoUpdate
	scene.matrixWorldAutoUpdate = false
	$effect(() => {
		return () => {
			scene.matrixWorldAutoUpdate = last
		}
	})
	// To update the matrices *once* per frame, we'll use a task that is added
	// right before the autoRenderTask. This way, we can be sure that the
	// matrices are updated before the renderers run.
	useTask(
		() => {
			scene.updateMatrixWorld()
		},
		{ before: autoRenderTask }
	)
	// The CSS2DRenderer needs to be updated after the autoRenderTask, so we
	// add a task that runs after it.
	useTask(
		() => {
			// Update the DOM
			cssRenderer.render(scene, camera.current)
		},
		{
			after: autoRenderTask,
			autoInvalidate: false
		}
	)




	const projectionRaycaster = new Raycaster();
	const SUBDIVISIONS = 20;
	const OFFSET_DISTANCE = 0.01;

	// --- Interaction Functions ---
	function handleMeshDblClick(event) {
		// Ensure the click happened on a mesh within the passed gltfScene
		let isMeshInLoadedScene = false;
		if (gltfScene && event.object?.isMesh) {
			event.object.traverseAncestors((ancestor) => {
				if (ancestor === gltfScene) {
					isMeshInLoadedScene = true;
				}
			});
		}

		// Ensure we have valid intersection data on the correct scene
		if (!isMeshInLoadedScene || !event.point || !event.face?.normal) {
			// console.log('Ignoring click (not on loaded model or invalid data)');
			return;
		}

		const currentClick = {
			point: event.point.clone(),
			normal: event.face.normal.clone(), // Clone to be safe
			mesh: event.object // Reference to the specific mesh clicked
		};

		// Add the click data
		currentClickData = [...currentClickData, currentClick];
		// console.log(`Click ${currentClickData.length} added`, currentClick);

		// If we have at least two points, generate a segment
		if (currentClickData.length >= 2) {
			const previousClick = currentClickData[currentClickData.length - 2];
			const segmentPointData = generateProjectedSegment(previousClick, currentClick, currentClick.mesh, camera.current);

			if (segmentPointData && segmentPointData.length > 1) {
				const offsetPoints = segmentPointData.map(pd =>
					new Vector3().copy(pd.point).addScaledVector(pd.normal, OFFSET_DISTANCE)
				);
				currentLineSegments = [
					...currentLineSegments,
					{
						id: currentLineSegments.length,
						points: offsetPoints,
						pointsData: segmentPointData // Store original data
					}
				];
				// console.log(`Segment ${currentLineSegments.length} added`);
			} else {
				console.warn('Segment generation failed or yielded insufficient points.');
			}
		}
	}

	function handleKeyDown(event) {
		// Finalize line on 'N'
		if (event.key === 'n' || event.key === 'N') {
			if (currentLineSegments.length > 0 && currentClickData.length > 0) {
				let allPointsWithNormals = [];
				currentLineSegments.forEach(segment => {
					if (segment.pointsData?.length > 0) {
						allPointsWithNormals = [...allPointsWithNormals, ...segment.pointsData];
					}
				});
				if (allPointsWithNormals.length === 0 && currentClickData.length > 0) { // Fallback if segments somehow failed
					allPointsWithNormals = currentClickData.map(click => ({ point: click.point, normal: click.normal }));
				}

				if (allPointsWithNormals.length > 0) {
					const pointsWithNormals = allPointsWithNormals.map((pd) => {
						const point = pd.point.clone();
						const normal = pd.normal ? pd.normal.clone() : new Vector3(0, 1, 0); // Use default if normal missing
						if (normal.lengthSq() > 0.0001) normal.normalize();
						return { point, normal };
					});

					const averageNormal = new Vector3(); let validNormals = 0;
					pointsWithNormals.forEach(pointData => {
						if (pointData.normal.lengthSq() > 0.0001) { averageNormal.add(pointData.normal); validNormals++; }
					});
					if (validNormals > 0) averageNormal.divideScalar(validNormals).normalize();

					console.log(`Finalizing line ${allLinesData.length + 1}. Average Normal: [${averageNormal.x.toFixed(3)}, ${averageNormal.y.toFixed(3)}, ${averageNormal.z.toFixed(3)}]`);
					// console.log('Points Data:', pointsWithNormals.map(p => `P: ${p.point.toArray().map(c=>c.toFixed(2))}, N: ${p.normal.toArray().map(c=>c.toFixed(2))}`).join('; '));


					allLinesData = [
						...allLinesData,
						{
							lineId: allLinesData.length,
							clicks: [...currentClickData],
							segments: [...currentLineSegments],
							pointsWithNormals: pointsWithNormals,
							averageNormal: averageNormal,
						}
					];
					userState.topo.routes.push(						{
						id: allLinesData.length,
						points: pointsWithNormals.map(p => p.point.toArray().map(c=>c.toFixed(2))),
						orientation: [averageNormal.x, averageNormal.y, averageNormal.z],
					})
				} else {
					console.warn("Finalize attempt failed: No valid points found.");
				}
				currentClickData = [];
				currentLineSegments = [];
			} else {
				console.log("Nothing to finalize.");
			}
		}
		// Cancel line on 'Escape'
		else if (event.key === 'Escape') {
			if (currentClickData.length > 0 || currentLineSegments.length > 0) {
				currentClickData = [];
				currentLineSegments = [];
				console.log('Current line cancelled.');
			}
		}
	}

	// Generate points along the surface between two clicks
	function generateProjectedSegment(startData, endData, mesh, cam) {
		if (!cam || !mesh || !startData?.point || !endData?.point) {
			console.error("generateProjectedSegment missing required data", { cam, mesh, startData, endData });
			return [];
		}

		const startPoint = startData.point.clone();
		const endPoint = endData.point.clone();
		// Ensure normals are valid or provide fallbacks
		const startNormal = (startData.normal && startData.normal.lengthSq() > 0.0001) ? startData.normal.clone().normalize() : new Vector3(0, 1, 0);
		const endNormal = (endData.normal && endData.normal.lengthSq() > 0.0001) ? endData.normal.clone().normalize() : new Vector3(0, 1, 0);

		const pointsData = [{ point: startPoint, normal: startNormal }];
		const tempVec = new Vector3();
		const tempDir = new Vector3();
		const startToEnd = new Vector3().subVectors(endPoint, startPoint);
		const segmentLength = startToEnd.length();

		// If segment is very short, just return start and end points
		if (segmentLength < 0.001) {
			pointsData.push({ point: endPoint, normal: endNormal });
			return pointsData;
		}

		const camPos = cam.position.clone();

		for (let i = 1; i < SUBDIVISIONS; i++) {
			const t = i / SUBDIVISIONS;
			// Interpolate point linearly in 3D space first
			const intermediatePoint = tempVec.copy(startPoint).addScaledVector(startToEnd, t);

			// Raycast from camera towards the interpolated point to find the surface point
			const rayDirection = tempDir.subVectors(intermediatePoint, camPos).normalize();
			projectionRaycaster.set(camPos, rayDirection);
			projectionRaycaster.near = cam.near;
			projectionRaycaster.far = cam.far;

			let hitPoint = null;
			let hitNormal = null;

			try {
				// Intersect with the specific mesh the points were clicked on
				// Pass `true` for recursive if gltfScene contains nested meshes
				const intersects = projectionRaycaster.intersectObject(mesh, false); // Set to true if mesh is a group

				// Find the closest intersection on the target mesh
				let closestIntersect = null;
				for(const intersect of intersects) {
					if(intersect.object === mesh) { // Ensure it hit the mesh we care about
						closestIntersect = intersect;
						break;
					}
				}


				if (closestIntersect && closestIntersect.face && closestIntersect.point) {
					hitPoint = closestIntersect.point.clone();
					// Get the normal in world space directly from the intersection data if possible
					// The face normal is typically in local space, needs transformation
					hitNormal = closestIntersect.face.normal.clone();
					// Transform normal to world space requires the object's world matrix normal part
					const normalMatrix = new THREE.Matrix3().getNormalMatrix(mesh.matrixWorld);
					hitNormal.applyMatrix3(normalMatrix).normalize();

				}
			} catch (error) {
				console.error('Raycasting failed during segment generation:', error);
			}

			// If raycast missed or failed, use the linearly interpolated point and normal
			if (!hitPoint || !hitNormal) {
				hitPoint = intermediatePoint.clone();
				hitNormal = new Vector3().lerpVectors(startNormal, endNormal, t).normalize();
			}

			pointsData.push({ point: hitPoint, normal: hitNormal });
		}

		pointsData.push({ point: endPoint, normal: endNormal }); // Add the last point
		return pointsData;
	}


	// Add/Remove keyboard listener
	onMount(() => {
		window.addEventListener('keydown', handleKeyDown);
		console.log('Model component mounted, keydown listener added.');
		// Cleanup function
		return () => {
			window.removeEventListener('keydown', handleKeyDown);
			console.log('Model component unmounted, keydown listener removed.');
		};
	});

</script>

{#if gltfScene}
	<T is={gltfScene}
		 ondblclick={handleMeshDblClick}
		 dispose={null}
	{...props}
	/>
{/if}

{#each currentLineSegments as segment (segment.id)}
	<T.Mesh>
		<MeshLineGeometry points={segment.points} />
		<MeshLineMaterial
			color={"#ff00ff"}
			width={0.015}
			resolution={$size.width && $size.height ? [$size.width, $size.height] : [1, 1]}
		/>
	</T.Mesh>
{/each}

{#each allLinesData as line (line.lineId)}
	<CssObject position={line.segments[0].points[0]}>
		{#snippet content()}
			<div class={"route-label"}>
				test
			</div>
		{/snippet}
		<div class={"route-label"}>
			test
		</div>
	</CssObject>
	{#each line.segments as segment (segment.id)}
		<T.Mesh>
			<MeshLineGeometry points={segment.points} />
			<MeshLineMaterial
				color={"#12538b"}
				width={0.01}
				resolution={$size.width && $size.height ? [$size.width, $size.height] : [1, 1]}
			/>
		</T.Mesh>
	{/each}
	{#if line.averageNormal && line.averageNormal.lengthSq() > 0.0001}
		{@const arrowOrigin = line.segments?.[0]?.points?.[0] ?? new Vector3(0,0,0)}
		<T is={ArrowHelper}
			 args={[
     line.averageNormal.normalize(), /* Ensure normalized */
     arrowOrigin, /* Place arrow at the start of the first segment */
     0.4,       /* length */
     0xff0000,  /* color */
     0.08,      /* headLength */
     0.05       /* headWidth */
    ]}
		/>
	{/if}
{/each}