<script>
	import { Canvas, T, useTask, useThrelte } from '@threlte/core';
	import { OrbitControls, Text } from '@threlte/extras';
	import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
	import { Box3, Vector3 } from 'three'; // Still need these for calculation
	import { onMount } from 'svelte';
	import Model from './Model.svelte';
	import { userState } from './state.svelte.js';


	// --- State ---
	let loadedGltfScene = $state(null);
	let modelPositionOffset = $state([0, 0, 0]); // State to hold the calculated position offset
	let isLoadingGltf = $state(false);
	let gltfError = $state(null);
	let fileInput = $state(null);
	let objectUrl = $state(null);
	let element = $state();
	let showExportModal = $state(false);

	const loader = new GLTFLoader();

	function handleFileSelect(event) {
		const file = event.target.files?.[0];
		if (!file) return;

		// Reset state for new model
		if (loadedGltfScene) loadedGltfScene = null;
		modelPositionOffset = [0, 0, 0]; // Reset position offset
		if (objectUrl) {
			URL.revokeObjectURL(objectUrl);
			objectUrl = null;
		}

		isLoadingGltf = true;
		gltfError = null;
		objectUrl = URL.createObjectURL(file);

		loader.load(
			objectUrl,
			(gltf) => {
				console.log('GLTF loaded successfully');
				const scene = gltf.scene || gltf.scenes?.[0];

				if (!scene) {
					console.error('Loaded GLTF contains no scene.');
					gltfError = 'Loaded GLTF contains no scene.';
					isLoadingGltf = false;
					if (objectUrl) {
						URL.revokeObjectURL(objectUrl);
						objectUrl = null;
					}
					loadedGltfScene = null;
					return;
				}

				// --->>> Calculate Centering Offset Start <<<---
				// Calculate bounding box of the *original* scene
				const box = new Box3().setFromObject(scene);

				if (box.isEmpty()) {
					console.warn('Model bounding box is empty, cannot calculate center offset.');
					// Keep offset at [0,0,0]
				} else {
					const center = new Vector3();
					box.getCenter(center);

					// Calculate the offset needed to move the center to the origin
					const offset = center.clone().negate();

					// Update the state variable with the calculated offset array
					modelPositionOffset = offset.toArray(); // Store as [x, y, z] array

					console.log(`Calculated model position offset: [${offset.x.toFixed(2)}, ${offset.y.toFixed(2)}, ${offset.z.toFixed(2)}]`);
				}
				// --->>> Calculate Centering Offset End <<<---

				// Update the state with the *unmodified* scene
				// The position offset will be applied via props in the template
				loadedGltfScene = scene;
				isLoadingGltf = false;

			},
			undefined, // Progress callback
			(err) => {
				console.error('Error loading GLTF:', err);
				gltfError = err.message || 'Failed to load GLTF file.';
				isLoadingGltf = false;
				loadedGltfScene = null;
				modelPositionOffset = [0, 0, 0]; // Reset offset on error
				if (objectUrl) {
					URL.revokeObjectURL(objectUrl);
					objectUrl = null;
				}
			}
		);
		event.target.value = '';
	}

	onMount(() => {
		return () => {
			if (objectUrl) {
				URL.revokeObjectURL(objectUrl);
			}
		};
	});

	function exportTopo() {
		userState.topo.date = new Date().toISOString().split('T')[0];
		userState.topo.updated = new Date().toISOString().split('T')[0];
		showExportModal = true;
	}

</script>

<div class="fixed top-25 left-15 z-50">
	<button
		class="font-semibold grid shadow-md border-1 border-gray-200 sm:w-auto w-1/3 cursor-pointer rounded-full bg-white py-3 px-6 text-center text-sm transition-all hover:shadow-lg text-slate-600 hover:text-white hover:bg-ink active focus:font-bold active:font-bold"
		onclick={() => fileInput?.click()}
		disabled={isLoadingGltf}
	>
		{#if isLoadingGltf} Lädt...{:else} 3D-Model laden{/if}
	</button>
	<input
		type="file"
		bind:this={fileInput}
		onchange={handleFileSelect}
		accept=".glb"
		hidden
	/>
	{#if gltfError && !isLoadingGltf}
		<p class="mt-2 text-sm text-red-600 bg-white/80 px-2 py-1 rounded">Error: {gltfError}</p>
	{/if}
	<button class="mt-5 font-semibold grid shadow-md border-1 border-gray-200 sm:w-auto w-1/3 cursor-pointer rounded-full bg-white py-3 px-6 text-center text-sm transition-all hover:shadow-lg text-slate-600 hover:text-white hover:bg-ink active focus:font-bold active:font-bold"
					onclick={exportTopo}>Exportieren</button>
</div>

{#if showExportModal}
	<div class="modal z-5000 fixed w-full h-full top-0 left-0 flex items-center justify-center p-8 lg:p-0">
		<div class="modal-overlay fixed w-full h-full bg-gray-900 opacity-50"></div>
		<div class="bg-white w-full lg:h-max lg:w-1/2  mx-auto rounded-lg shadow-xl z-50 overflow-y-auto">
			<button class="fa-solid fa-xmark text-gray-400 text-3xl float-right cursor-pointer m-5 mr-7"
			onclick={() => showExportModal = false}></button>
			<div class="content p-20 text-center place-self-center">
				<textarea readonly class="w-130 h-130 bg-gray-100 rounded-2xl p-5">{JSON.stringify(userState.topo, undefined, 4)}</textarea>
			</div>
		</div>
	</div>
{/if}

<div class="fixed top-25 right-12 z-50">
	<div class="overflow-y-scroll h-fit max-h-190">
		<div class="bg-white rounded-2xl shadow-md p-5 mb-5 mr-5 w-100 border-1 border-gray-200">
			<h3 class="text-lg font-semibold mb-4">Topo Infos</h3>
			<div class="flex flex-row">
				<label for="name" class="block mb-2 mt-1 mr-2 text-sm font-medium w-1/3">Name:</label>
				<input
					type="text"
					id="name"
					bind:value={userState.topo.name}
					class="w-full px-3 py-1 rounded-full text-sm border-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-4"
				/></div>
			<div class="flex flex-row">
				<label for="author" class="block mb-2 mt-1 mr-2 text-sm font-medium w-1/3">Autor:</label>
				<input
					type="text"
					id="author"
					bind:value={userState.topo.author}
					class="w-full px-3 py-1 rounded-full text-sm border-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-4"
				/></div>
			<div class="flex flex-row">
				<label for="rock" class="block mb-2 mt-1 mr-2 text-sm font-medium w-1/3">Felsart:</label>
				<select name="rock" id="type" bind:value={userState.topo.rock}
								class="w-full px-3 py-1 rounded-full text-sm border-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-4">
					<option value="granite">Granit</option>
					<option value="gneiss">Gneis</option>
					<option value="limestone">Kalkstein</option>
					<option value="dolomite">Dolomit</option>
					<option value="sandstone">Sandstein</option>
					<option value="basalt">Basalt</option>
					<option value="tuff">Tuff</option>
					<option value="rhyolite">Rhyolith</option>
					<option value="quartzite">Quarzit</option>
					<option value="conglomerate">Konglomerat</option>
					<option value="schist">Schiefer</option>
				</select>
			</div>
			<div class="flex flex-row">
				<label for="description" class="block mb-2 mt-1 mr-2 text-sm font-medium w-1/3">Beschreibung:</label>
				<textarea
					id="description"
					bind:value={userState.topo.description}
					class="w-full px-3 py-1 rounded-2xl text-sm border-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-4"
				></textarea></div>
		</div>
		{#each userState.topo.routes as route}
			<div class="bg-white rounded-2xl shadow-md p-5 mb-5 mr-5 w-100 border-1 border-gray-200">
				<h3 class="text-lg font-semibold mb-4">Route {route.id}</h3>
				<div class="flex flex-row">
					<label for="name" class="block mb-2 mt-1 mr-2 text-sm font-medium w-1/3">Name:</label>
					<input
						type="text"
						id="name"
						bind:value={route.name}
						class="w-full px-3 py-1 rounded-full text-sm border-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-4"
					/></div>
				<div class="flex flex-row">
					<label for="type" class="block mb-2 mt-1 mr-2 text-sm font-medium w-1/3">Art:</label>
					<select name="type" id="type" bind:value={route.type}
									class="w-full px-3 py-1 rounded-full text-sm border-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-4">
						<option value="sports-climbing">Sport</option>
						<option value="bouldering">Bouldern</option>
						<option value="trad">Traditionell</option>
						<option value="multi-pitch">Mehrseillängen</option>
					</select>
				</div>
				<div class="flex flex-row">
					<label for="grade" class="block mb-2 mt-1 mr-2 text-sm font-medium w-1/3">Grad:</label>
					<select name="grade" id="grade" bind:value={route.grade}
									class="w-full px-3 py-1 rounded-full text-sm border-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-4">
						{#each [1, 2, 3, 4, 5, 6, 7, 8, 9] as i}
							{#each ["a", "b", "c"] as x}
								{#each ["-", "", "+"] as m}
									<option value={i + x + m}>{i + x + m}</option>
								{/each}
							{/each}
						{/each}
					</select>
				</div>
				{#if route.type === "sports-climbing"}
					<div class="flex flex-row">
						<label for="boltAmount" class="block mb-2 mt-1 mr-2 text-sm font-medium w-1/3">Exen-Anzahl:</label>
						<input
							type="number"
							id="boltAmount"
							bind:value={route.boltAmount}
							class="w-full px-3 py-1 rounded-full text-sm border-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-4"
						/></div>
				{/if}
				{#if route.type === "sports-climbing"}
					<div class="flex flex-row">
						<label for="length" class="block mb-2 mt-1 mr-2 text-sm font-medium w-1/3">Länge:</label>
						<input
							type="number"
							id="length"
							bind:value={route.length}
							class="w-full px-3 py-1 rounded-full text-sm border-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-4"
						/></div>
				{/if}
				<div class="flex flex-row">
					<label for="description" class="block mb-2 mt-1 mr-2 text-sm font-medium w-1/3">Beschreibung:</label>
					<textarea
						id="description"
						bind:value={route.description}
						class="w-full px-3 py-1 rounded-2xl text-sm border-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-4"
					></textarea></div>
			</div>
		{/each}
	</div>
</div>

<div class="h-screen w-screen absolute">
	<div id="css-renderer-target" bind:this={element}
			 style="position: absolute; top: 0; left: 0; width: 100%; pointer-events: none; height: 100%; z-index: 1;"></div>

	<Canvas linear>
		<T.PerspectiveCamera makeDefault position={[0, 1, 5]} fov={75} near={0.1} far={1000}>
			<OrbitControls enableZoom={true} target={[0, 0, 0]} />
		</T.PerspectiveCamera>

		<T.AmbientLight intensity={0.6} />
		<T.DirectionalLight position={[5, 10, 7]} intensity={1.2} />
		<T.HemisphereLight skyColor={'#ffffff'} groundColor={'#444444'} intensity={0.5} />

		{#if element !== undefined}
			<Model
				gltfScene={loadedGltfScene}
				position={modelPositionOffset}
				{element}
			/>
		{/if}
	</Canvas>
</div>

<style>
    :global(.route-label) {
        background-color: rgba(0, 0, 0, 0.65);
        color: white;
        padding: 3px 7px;
        border-radius: 4px;
        font-size: 9px;
        font-family: sans-serif;
        white-space: nowrap;
        text-align: center;
        /* Added cursor pointer for visual feedback */
        cursor: pointer;
    }
</style>