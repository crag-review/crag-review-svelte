<script>
	import '../app.css';
	import { page } from '$app/stores'
	import { siteTitle, siteLink } from '$lib/config.js';
	import { base } from '$app/paths';
	import '@fortawesome/fontawesome-free/css/fontawesome.css';
	import '@fortawesome/fontawesome-free/css/brands.css';
	import '@fortawesome/fontawesome-free/css/solid.css';
	/** @type {{children?: import('svelte').Snippet}} */
	let { children } = $props();
</script>

<svelte:head>
	<title>{$page.data.meta?.title}</title>
	<meta name="title" content={$page.data.meta?.title}/>
	<meta name="description" content={$page.data.meta?.description}/>
	<meta name="author" content="{$page.data.meta?.author}"/>
	<meta property="og:site_name" content="Vorstieg"/>
	<meta property="og:type" content="{$page.data.meta?.type}"/>
	<meta property="og:url" content={$page.data.meta?.url}/>
	<meta property="og:locale" content={$page.data.meta?.lang}/>
	<meta property="og:title" content={$page.data.meta?.title}/>
	<meta property="og:description" content={$page.data.meta?.description}/>
	<meta name="twitter:title" content={$page.data.meta?.title} />
	<meta name="twitter:description" content={$page.data.meta?.description} />
	<meta property="og:image" content={$page.data.meta?.image}/>
	<meta property="og:image:secure_url" content={$page.data.meta?.image}/>
	<meta property="og:image:type" content="image/jpg"/>
	<meta property="og:image:width" content="1707"/>
	<meta property="og:image:height" content="1233"/>
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
		<main id="main" class="overflow-auto" tabindex="-1">
			{@render children?.()}
		</main>
</div>
<style></style>