<script lang="ts">
	import { Canvas, useTask, useThrelte, T } from '@threlte/core';
	import { OrbitControls } from '@threlte/extras';
	import { onMount } from 'svelte';
	import { CSS2DRenderer } from 'three/examples/jsm/renderers/CSS2DRenderer.js';
	import { resize } from '$lib/assets/js/resize.js';
	import Model from './Model.svelte';
	import RouteLine from './RouteLine.svelte';
	import { base } from '$app/paths';
	import { goto } from '$app/navigation';
	import Chart from 'chart.js/auto';
	let chartData;

	let chartValues = [20, 10, 5, 2, 20, 30, 45];
	let chartLabels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
	let ctx;
	let chartCanvas;

	let { data } = $props();

	function SceneSetup() {
		const { scene, size, autoRenderTask, camera } = useThrelte();
		let cssRenderer;
		let targetElement;
		onMount(() => {
			ctx = chartCanvas.getContext('2d');
			var chart = new Chart(ctx, {
				type: 'line',
				data: {
					labels: chartLabels,
					datasets: [{
						label: 'Revenue',
						backgroundColor: 'rgb(255, 99, 132)',
						borderColor: 'rgb(255, 99, 132)',
						data: data.route.points.map(point => point[2])
					}]
				}
			});
			targetElement = document.getElementById('css-renderer-target');
			if (targetElement && scene && camera && size) {
				cssRenderer = new CSS2DRenderer({ element: targetElement });
				const unsubscribeSize = size.subscribe(value => {
					if (cssRenderer && value.width && value.height) {
						cssRenderer.setSize(value.width, value.height);
					}
				});
				scene.matrixWorldAutoUpdate = false;
				return () => {
					unsubscribeSize();
					if (targetElement) targetElement.innerHTML = '';
					scene.matrixWorldAutoUpdate = true;
				};
			}
		});
		useTask(() => {
			if (!scene.matrixWorldAutoUpdate) scene.updateMatrixWorld();
		}, { before: autoRenderTask, autoInvalidate: false });
		useTask(() => {
			if (cssRenderer && scene && camera?.current) cssRenderer.render(scene, camera.current);
		}, { after: autoRenderTask, autoInvalidate: false });
		return null;
	}
</script>

<div class="h-screen w-screen md:w-3/4 absolute">
	<div id="css-renderer-target"
			 style="position: absolute; top: 0; left: 0; width: 100%; pointer-events: none; height: 100%; z-index: 1;"></div>

	<Canvas>
		<T.PerspectiveCamera makeDefault position={[0, 1, 5]} fov={75} near={0.1} far={1000}>
			<OrbitControls enableZoom={true} />
		</T.PerspectiveCamera>

		<T.AmbientLight intensity={0.6} />
		<T.DirectionalLight position={[5, 10, 7]} intensity={1} />

		<Model position={[-10,2,0]} />
		{#if data && data.topo.routes}
			{#each data.topo.routes as route (route.id)}
				<RouteLine
					link={base + "/topo/crag/" + data.path + "/" +route.id}
					points={route.points}
					name={route.name}
					grade={route.grade}
					id={route.id}
					color={data.route?.id === route.id ? "#ff0000" : "#ff9100"}
					width={data.route?.id === route.id ? 0.025 : 0.02}
				/>
			{/each}
		{/if}

		<SceneSetup />
	</Canvas>
</div>


<main class="z-[500] h-24">
	<div use:resize
			 class="box border-1 border-gray-200 fixed sm:left-auto left-0 right-0 mx-1 sm:!mx-2 sm:right-10 sm:!h-auto top-1/2 lg:!top-30 sm:!top-25 bottom-1 lg:!bottom-20 sm:!bottom-10 w-auto sm:w-[25rem] lg:w-[40rem] bg-white rounded-4xl sm:!rounded-3xl shadow-md z-[20000]">
		<div class="bg-gray-200 h-1 w-12 rounded-full justify-self-center mt-2 sm:hidden"></div>
		<a
			class="fixed right-5 sm:right-15 cursor-pointer bg-white w-8 h-8 pt-1.5 text-sm sm:mt-2 hover:text-white hover:bg-ink rounded-full border-1 text-center border-gray-200 transition-all ml-3 z-[5000]"
			href="{base}/map"><i class="fa-lg fa-solid fa-xmark"></i></a>
		<button
			class="fixed right-15 sm:right-25 cursor-pointer bg-white w-8 h-8 pt-0.5 text-sm sm:mt-2 hover:text-white hover:bg-ink rounded-full border-1 text-center border-gray-200 transition-all ml-3 z-[5000]"
			on:click={share}><i class="fa-solid fa-share-nodes"></i></button>
		{#if data.route}
			<div class="justify-self-center sm:justify-self-start w-screen sm:w-auto px-5 pr-20 flex flex-row pt-6 pb-5">
				<h1 class="text-2xl font-bold my-0 text-slate-800 sm:px-2">{data.route.name}</h1>
			</div>
			<div
				class="overflow-y-scroll w-full justify-self-center px-5 mb-36 sm:mb-26 overflow-x-hidden"
				style="height: -webkit-fill-available">
						<div class="mb-5 prose mx-auto">
							<div class="border-b-1 p-3">{data.route.description}</div>
							<div class="border-b-1 p-3">Kletterart: {data.route.type}</div>
							<div class="border-b-1 p-3">Grad: {data.route.grade}</div>
							<div class="border-b-1 p-3">Länge: {data.route.length} m</div>
							<div class="border-b-1 p-3">Anzahl an benötigten Exen: {data.route.boltAmount}</div>
							<div class="border-b-1 p-3">Steinart: {data.topo.rock}</div>
						</div>
				<canvas bind:this={chartCanvas} id="myChart"></canvas>

			</div>
			{:else}
			<div class="justify-self-center sm:justify-self-start w-screen sm:w-auto px-5 pr-20 flex flex-row pt-6 pb-5">
				<h1 class="text-2xl font-bold my-0 text-slate-800 sm:px-2">{data.topo.name}</h1>
			</div>
			<div
				class="overflow-y-scroll w-screen sm:w-auto justify-self-center px-5 mb-36 sm:mb-26 overflow-x-hidden"
				style="height: -webkit-fill-available">
				<div class="flex items-center mt-10 mb-10">
					<div class="prose text-slate-800">
						<div class="mb-5 w-full">
							<span>{data.topo.description}</span>
							<div class="overflow-x-auto sm:rounded-lg border border-gray-200">
								<table class="min-w-full divide-y divide-gray-200 !m-0">
									<thead class="bg-gray-50">
									<tr>
										{#each ["Name", "Grad", "Länge"] as column}
											<th scope="col"
													class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
												{column}
											</th>
										{/each}
									</tr>
									</thead>
									<tbody class="bg-white divide-y divide-gray-200">
									{#each data.topo.routes as route}
										<tr
											class="hover:bg-gray-50 cursor-pointer"
											on:click={() => goto(base + "/topo/crag/" + data.path + "/" +route.id)}
										>
											<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
												{route.name}
											</td>
											<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
												{route.grade}
											</td>
											<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
												{route.length}m
											</td>
										</tr>
									{/each}
									</tbody>
								</table>
							</div>
						</div>
					</div>
				</div>
			</div>
		{/if}
	</div>
</main>

<style>
    :global(.grabber.top) {
        height: 100px;
        width: 100%;
        position: absolute;
        top: -5px;
        cursor: pointer;
    }

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

    /* Add any page-specific styles or Tailwind directives here if needed */
    .transition-transform {
        transition: transform 0.3s ease-in-out;
    }

    .rotate-180 {
        transform: rotate(180deg);
    }
</style>