<script>
	import { base } from '$app/paths';
	import ClimbingMap from '$lib/components/ClimbingMap.svelte';
	import { snapToBiggestHeight, resize } from './resize.js';

	export let data;

	const { title, excerpt, coverImage, coverWidth, coverHeight, categories } =
		data.meta;
	const { PostContent } = data;
	const locations = data.meta.map;
	const zoom = data.meta.zoom;
	const center = data.meta.location;

	function onMarkerClicked() {
		if (snapToBiggestHeight) {
			snapToBiggestHeight();
		}
	}
</script>

<svelte:head>
	<title>{title}</title>
	<meta data-key="description" name="description" content={excerpt} />
	<meta property="og:type" content="article" />
	<meta property="og:title" content={title} />
	<meta name="twitter:title" content={title} />
	<meta property="og:description" content={excerpt} />
	<meta name="twitter:description" content={excerpt} />
	<meta property="og:image:width" content={coverWidth} />
	<meta property="og:image:height" content={coverHeight} />
</svelte:head>

<ClimbingMap onMarkerClicked={onMarkerClicked} {locations} {zoom} {center}></ClimbingMap>

<main class="z-[500] h-24">
	<div use:resize
			 class="box border-1 border-gray-200 fixed sm:left-auto left-0 right-0 mx-2 sm:!mx-2 sm:right-10 sm:!h-auto top-1/2 lg:!top-30 sm:!top-25 bottom-5 lg:!bottom-20 sm:!bottom-10 w-auto sm:w-[25rem] lg:w-[40rem] bg-white rounded-3xl sm:!rounded-3xl shadow-md z-[2000]">
		<div class="bg-gray-200 h-1 w-12 rounded-full justify-self-center mt-2 sm:hidden"></div>
		<div class="justify-self-center sm:justify-self-start w-screen sm:w-auto px-10">
			<h1 class="text-2xl font-black my-0 text-slate-800 pt-6 pb-5">{title}</h1>
		</div>
		<div class="overflow-y-scroll w-screen sm:w-auto justify-self-center px-10 mb-[10rem] sm:mb-[7rem] overflow-x-hidden" style="height: -webkit-fill-available">
			{#if categories}
				<aside class="mb-5">
					{#each categories as category}
						<a href="{base}/map/{category}/" class="bg-blue-100 hover:bg-blue-200 text-blue-800 text-sm font-semibold me-2 px-2.5 py-0.5 rounded-full border border-blue-400 inline-flex items-center justify-center">{category}</a>
					{/each}
				</aside>
			{/if}
			<div class="mx-auto h-48 bg-cover bg-center bg-no-repeat rounded-md"
					 style="background-image:url('{base}/images/main/{coverImage}');">
			</div>
			<div class="justify-center flex items-center mt-10 mb-10">
				<div class="prose text-slate-800">
					<svelte:component this={PostContent} />
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

