<!-- This file renders each individual blog post for reading. Be sure to update the svelte:head below -->
<script>
	import { base } from '$app/paths';
	import { Button } from 'flowbite-svelte';
	import {Accordion, AccordionItem} from 'flowbite-svelte';
	import ClimbingMap from '$lib/components/ClimbingMap.svelte';

	export let data;

	const { title, excerpt, coverImage, coverWidth, coverHeight, categories } =
		data.meta;
	const { PostContent } = data;
	const locations = data.meta.map
	const zoom = data.meta.zoom
	const center = data.meta.location
</script>

<svelte:head>
	<!-- Be sure to add your image files and un-comment the lines below -->
	<title>{title}</title>
	<meta data-key="description" name="description" content={excerpt} />
	<meta property="og:type" content="article" />
	<meta property="og:title" content={title} />
	<meta name="twitter:title" content={title} />
	<meta property="og:description" content={excerpt} />
	<meta name="twitter:description" content={excerpt} />
	<!-- <meta property="og:image" content="https://yourdomain.com/image_path" /> -->
	<meta property="og:image:width" content={coverWidth} />
	<meta property="og:image:height" content={coverHeight} />
	<!-- <meta name="twitter:image" content="https://yourdomain.com/image_path" /> -->
</svelte:head>

<div class="mx-auto h-[60vh] bg-cover bg-fixed bg-center bg-no-repeat shadow-lg" style="background-image:url('{base}/images/main/{coverImage}');">

</div>
<article class="flex flex-col items-center justify-center">

	<h1 class="text-4xl mt-5 mb-5">{title}</h1>

	{#if !!locations}

		<ClimbingMap {locations} {zoom} {center}></ClimbingMap>
	{/if}
	<div class="justify-center flex items-center mt-5">
		<div class="prose lg:prose-xl w-full">
			<svelte:component this={PostContent} />
		</div>
	</div>


</article>
{#if categories}
<aside class="post-footer">
	<h2 class="mt-5">Posted in:</h2>
		{#each categories as category}
			<Button href="{base}/blog/category/{category}/" class="my-5 mr-5" pill>{category}</Button>
		{/each}
</aside>
{/if}