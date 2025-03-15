<script>
	import '../app.css';
	import { siteTitle, siteLink } from '$lib/config.js';
	import { base } from '$app/paths';
	import '@fortawesome/fontawesome-free/css/fontawesome.css';
	import '@fortawesome/fontawesome-free/css/brands.css';
	import '@fortawesome/fontawesome-free/css/solid.css';
	import { onMount } from 'svelte';
	import { preloadCode } from '$app/navigation';

	export let data;
	/**
	 * This pre-fetches all top-level routes on the site in the background for faster loading.
	 * https://kit.svelte.dev/docs/modules#$app-navigation-preloaddata
	 *
	 * Any route added in src/lib/config.js will be preloaded automatically. You can add your
	 * own preloadData() calls here, too.
	 **/
	onMount(() => {
		const navRoutes = navItems?.map((item) => base + item.route);
		preloadCode(...navRoutes);
	});
</script>

<!-- This is the global layout file; it "wraps" every page on the site. (Or more accurately: is the parent component to every page component on the site.) -->

<svelte:head>
	<link rel="stylesheet" href="{base}/css/vars.css" />
	<link rel="stylesheet" href="{base}/css/root.css" />
	<link rel="stylesheet" href="{base}/css/typography.css" />
	<link rel="stylesheet" href="{base}/css/layout.css" />
	<link rel="stylesheet" href="{base}/css/utilities.css" />
	<link rel="stylesheet" href="{base}/css/prism.css" />
	<link rel="icon" href="{base}/favicon.png" />
	<link rel="alternate" type="application/rss+xml" title={siteTitle} href="{siteLink}api/rss.xml" />
</svelte:head>

<div class="layout">
	<div class="fixed w-full sm:w-auto bottom-0 sm:bottom-auto p-2 sm:right-10 sm:top-5 z-[3000]">
		<div class="row h-16 sm:h-auto flex w-full bg-white justify-center shadow-md border-1 border-gray-200 rounded-full">
			<a href="{base}/map"
				class="font-semibold grid sm:w-auto w-1/3 cursor-pointer rounded-full bg-white rounded-r-none py-3 px-6 text-center text-sm transition-all hover:shadow-lg text-slate-600 hover:text-white hover:bg-ink active focus:font-bold active:font-bold"
				type="button">
				<i class="font-semibold sm:hidden! fa-solid fa-map-location-dot mb-2"></i>
				Karte
			</a>
			<a href="{base}/list"
				class="font-semibold grid sm:w-auto w-1/3 cursor-pointer bg-white rounded-none sm:border-l sm:border-r border-slate-200 py-3 px-6 text-center text-sm transition-all hover:shadow-lg text-slate-600 hover:text-white hover:bg-ink active focus:font-bold active:font-bold"
				type="button">
				<i class="font-semibold sm:hidden! fa-solid fa-list-ul mb-2"></i>
				Liste
			</a>
			<a href="{base}/about"
				class="font-semibold grid sm:w-auto w-1/3 cursor-pointer bg-white rounded-full rounded-l-none sm:border-r border-slate-200 py-3 px-6 text-center text-sm transition-all hover:shadow-lg text-slate-600 hover:text-white hover:bg-ink active focus:font-bold active:font-bold"
				type="button">
				<i class="font-semibold sm:hidden! fa-solid fa-circle-info mb-2"></i>
				Info
			</a>
		</div>
	</div>
	<div class="absolute h-fit fixed w-full sm:w-auto bottom-0 sm:bottom-auto p-2 left-5 sm:left-15 top-4 z-[1000]">
		<span class="text-4xl md:text-5xl font-black text-stroke-8 text-stroke-white">Felsverzeichnis</span>
	</div>
	{#key data.path}
		<main id="main" class="overflow-auto" tabindex="-1">
			<slot />
		</main>
	{/key}
</div>

<style></style>