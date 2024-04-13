<!-- This is the global layout file; it "wraps" every page on the site. (Or more accurately: is the parent component to every page component on the site.) -->
<script>
	import Header from '$lib/components/Header.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import { currentPage, isMenuOpen } from '../lib/assets/js/store.js';
	import { navItems } from '$lib/config';
	import { preloadCode } from '$app/navigation';
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import { siteTitle, siteURL } from '$lib/config.js';
	import { basePath } from '$app/paths';
	export let data;

	const transitionIn = { delay: 150, duration: 150 };
	const transitionOut = { duration: 100 };

	/**
	 * Updates the global store with the current path. (Used for highlighting
	 * the current page in the nav, but could be useful for other purposes.)
	 **/
	$: currentPage.set(data.path);

	/**
	 * This pre-fetches all top-level routes on the site in the background for faster loading.
	 * https://kit.svelte.dev/docs/modules#$app-navigation-preloaddata
	 *
	 * Any route added in src/lib/config.js will be preloaded automatically. You can add your
	 * own preloadData() calls here, too.
	 **/
	onMount(() => {
		const navRoutes = navItems.map((item) => item.route);
		preloadCode(...navRoutes);
	});
</script>

<svelte:head>
	<link rel="stylesheet" href="{basePath}/css/vars.css" />
	<link rel="stylesheet" href="{basePath}/css/root.css" />
	<link rel="stylesheet" href="{basePath}/css/fonts.css" />
	<link rel="stylesheet" href="{basePath}/css/typography.css" />
	<link rel="stylesheet" href="{basePath}/css/layout.css" />
	<link rel="stylesheet" href="{basePath}/css/components.css" />
	<link rel="stylesheet" href="{basePath}/css/header-and-footer.css" />
	<link rel="stylesheet" href="{basePath}/css/forms.css" />
	<link rel="stylesheet" href="{basePath}/css/animation.css" />
	<link rel="stylesheet" href="{basePath}/css/utilities.css" />
	<link rel="stylesheet" href="{basePath}/css/code.css" />
	<link rel="stylesheet" href="{basePath}/css/prism.css" />
	<link
		rel="alternate"
		type="application/rss+xml"
		title={siteTitle}
		href="http://{siteURL}/api/rss.xml"
	/>
</svelte:head>

<!--
	The below markup is used on every page in the site. The <slot> is where the page's
	actual contents will show up.
-->
<div class="layout" class:open={$isMenuOpen}>
	<Header />
	{#key data.path}
		<main id="main" tabindex="-1" in:fade|global={transitionIn} out:fade|global={transitionOut}>
			<slot />
		</main>
	{/key}
	<Footer />
</div>
