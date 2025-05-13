<script>
	import { T } from '@threlte/core';
	import { useGltf, Text, interactivity } from '@threlte/extras'; // Import Text for fallbacks

	interactivity()
	// Use $props() rune - captures position and any other props
	let {
		position = [0, 0, 0], // Default position if none is passed
		...props // Capture rest props like scale, rotation if passed
	} = $props();

	// Load the specified GLTF file
	const gltf = useGltf('/ruine-dürnstein.glb');

</script>
{#await gltf}
		<T.Mesh>
			<T.SphereGeometry args={[0.1]} />
			<T.MeshBasicMaterial color="orange" wireframe={true} />
		</T.Mesh>
{:then gltfInstance}
	<T {...props} is={gltfInstance.scene} {position} />
{:catch error}
	<T.Group {position}>
		<T.Mesh>
			<T.SphereGeometry args={[0.1]} />
			<T.MeshBasicMaterial color="red" wireframe={true} />
			<Text text={'Error: ' + error.message} anchorX='center' anchorY='middle' position={[0,-0.3,0]} fontSize={0.08} />
		</T.Mesh>
	</T.Group>
{/await}