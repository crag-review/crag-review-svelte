<script>
	import { siteTitle } from '$lib/config.js';
	import { base } from '$app/paths';
	/** @type {{data: any}} */
	let { data } = $props();

	const { activeCategory } = data;
</script>

<svelte:head>
	<title>{siteTitle}</title>
</svelte:head>

<div class="absolute h-fit fixed w-full sm:w-auto bottom-0 sm:bottom-auto p-2 left-25 sm:left-35 top-18 sm:top-20 z-[1000]">
	<div class="cursor-pointer shadow-lg font-semibold text-white bg-ink mb-2 text-sm me-2 p-2 px-4 rounded-full inline-flex items-center justify-center">{activeCategory}</div>
	<a href="{base}/map"
		 class="cursor-pointer bg-white hover:shadow-xl font-semibold hover:bg-ink hover:text-white mb-2 text-sm me-2 p-3 px-4 rounded-full shadow-md inline-flex items-center justify-center"><i class="fa-solid fa-close"></i></a>
</div>

