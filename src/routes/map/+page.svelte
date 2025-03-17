<script>
	import ClimbingMap from '$lib/components/ClimbingMap.svelte';
	import { siteTitle } from '$lib/config.js';
	import { base } from '$app/paths';

	export let data;

	const { posts, categories } = data;
	const locations = posts.filter(value => !!value.location);
</script>

<svelte:head>
	<title>{siteTitle}</title>
</svelte:head>

<ClimbingMap onMarkerClicked={() => console.log("")} {locations}></ClimbingMap>

<div class="fixed h-fit no-scrollbar overflow-x-auto sm:w-auto sm:left-26 left-18 right-0 py-2 top-20 z-[1000] fade">
	<span class="px-4"></span>
	{#each categories as category}
		<a href="{base}/map/{category}"
			 class="cursor-pointer bg-white hover:shadow-xl font-semibold hover:bg-ink hover:text-white mb-2 text-sm me-2 p-2 px-4 rounded-full shadow-md items-center justify-center">{category}</a>
	{/each}
	<span class="px-4"></span>
</div>

<style>
    @media (width <= 40rem) {
        .fade {
            -webkit-mask: linear-gradient(to right, transparent 10%, #fff 15% 90%, transparent 95%),
            linear-gradient(to left, transparent 10%, #fff 15% 90%, transparent 95%);
        }
    }
</style>
