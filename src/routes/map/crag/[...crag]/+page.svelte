<script>
	import { base } from '$app/paths';
	import { snapToBiggestHeight, resize } from '$lib/assets/js/resize.js';
	import { afterNavigate } from '$app/navigation';
	import { types } from '$lib/config.js';

	let fullscreenImage = $state();

	/** @type {{data: any}} */
	let { data } = $props();
	const { type, name, path, topo, description, transit, parking, meta } = data;

	afterNavigate((_navigation) => {
		if (location.hash) onMarkerClicked();
	});

	function onMarkerClicked() {
		if (snapToBiggestHeight) {
			snapToBiggestHeight();
		}
	}

	const imageFiles = import.meta.glob(
		'$lib/entries/**/*.{jpg,jpeg,png,gif,pdf}',
		{
			eager: true,
			query: {
				enhanced: true,
				w: '1280;640;400'
			}
		}
	);
	const images = Object.entries(imageFiles).filter(([key]) => new RegExp(`^/src/lib/entries/${path}/.*$`).test(key)).map(([, value]) => value);

	async function share() {
		await navigator.share({
			title: name,
			text: description,
			url: meta.url
		});
	}
</script>

{#if fullscreenImage}
	<div class="absolute top-0 bottom-0 left-0 right-0 z-[30000] bg-black opacity-70"></div>
	<div on:click={() => fullscreenImage = undefined}
			 class="absolute top-0 bottom-0 left-0 right-0 z-[30000] flex justify-center items-center">
		<enhanced:img class="self-center" src={fullscreenImage} />
	</div>
{/if}
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
		<div class="justify-self-center sm:justify-self-start w-screen sm:w-auto px-5 pr-20 flex flex-row pt-6 pb-5">
			<h1 class="text-2xl font-bold my-0 text-slate-800 sm:px-2">{name}</h1>
		</div>
		<div
			class="overflow-y-scroll w-screen sm:w-auto justify-self-center px-5 mb-36 sm:mb-26 overflow-x-hidden"
			style="height: -webkit-fill-available">
			{#if images?.length === 1}
				<enhanced:img on:click={() => fullscreenImage = images[0].default}
											class="mx-auto h-71 object-cover rounded-md cursor-pointer" src={images[0].default} />
			{:else if images?.length >= 1}
				<div class="flex flex-col flex-wrap content-start h-73 overflow-x-auto no-scrollbar">
					{#each images as image ,i}
						{#if i === 0}
							<enhanced:img on:click={() => fullscreenImage = image.default}
														class="w-60 h-71 mr-1.5 mb-1.5 rounded-2xl object-cover cursor-pointer"
														sizes="(min-width:1920px) 1280px, (min-width:1080px) 640px, (min-width:768px) 400px"
														src={image.default} />
						{:else}
							<enhanced:img on:click={() => fullscreenImage = image.default}
														class="w-34.5 h-34.5 mr-1.5 mb-1.5 rounded-2xl object-cover cursor-pointer"
														sizes="(min-width:1920px) 1280px, (min-width:1080px) 640px, (min-width:768px) 400px"
														src={image.default} />
						{/if}
					{/each}
				</div>
			{/if}
			<aside class="mt-5">
				<a href="{base}/map/{type}/"
					 class="bg-blue-100 hover:bg-blue-200 text-blue-800 text-sm font-semibold me-2 px-2.5 py-0.5 rounded-full border border-blue-400 inline-flex items-center justify-center">{types.get(type)}</a>
			</aside>
			<div class="flex items-center mt-10 mb-10">
				<div class="prose text-slate-800">
					<div class="mb-5 w-full">
						{#if topo}
							<a href={topo.link} target="_blank"
								 class="border-1 border-gray-200 h-10 mb-2 mr-2 text-slate-600 hover:text-white hover:bg-ink inline-flex items-center justify-center p-1 px-3 text-base font-medium rounded-full no-underline">
								<i class="fa-solid fa-route mr-2"></i>
								<span class="w-full">Topo</span>
							</a>
						{/if}
						{#if transit}
							<div class="inline-flex mb-2 mr-2">
								<span
									class="border-1 border-gray-200 h-10 text-slate-600 inline-flex items-center justify-center p-1 px-3 text-base font-medium rounded-l-full no-underline "><i
									class="fa-solid fa-train"></i>
								</span>
								<a
									href="https://www.google.com/maps/dir/?api=1&destination={transit[1]},{transit[0]}&travelmode=transit"
									target="_blank"
									class="border-1 border-gray-200 h-10 text-slate-600 hover:text-white hover:bg-ink inline-flex items-center justify-center p-1 px-3 text-base font-medium no-underline">
									Google Maps
								</a>
								<a
									href="https://fahrplan.oebb.at/webapp/?context=TP&ZID=A%3D1%40X%3D{Math.trunc(transit[0]*1000000)}%40Y%3D{Math.trunc(transit[1]*1000000)}&timeSel=1&returnTimeSel=1&journeyProducts=7167&start=1&#!P%7CTP!H%7C952087"
									target="_blank"
									class="border-1 border-gray-200 h-10 text-slate-600 hover:text-white hover:bg-ink inline-flex items-center justify-center p-1 px-3 text-base font-medium no-underline rounded-r-full">
									Scotty
								</a>
							</div>
						{/if}
						{#if parking}
							<a
								href="https://www.google.com/maps/dir/?api=1&destination={parking[1]},{parking[0]}"
								target="_blank"
								class="border-1 border-gray-200 h-10 mb-2 mr-2 text-slate-600 hover:text-white hover:bg-ink inline-flex items-center justify-center p-1 px-3 text-base font-medium rounded-full no-underline">
								<i class="fa-solid fa-car mr-2"></i>
								<span class="w-full">Google Maps</span>
							</a>
						{/if}
					</div>
					<span>{description}</span>
				</div>
			</div>
		</div>
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
</style>

