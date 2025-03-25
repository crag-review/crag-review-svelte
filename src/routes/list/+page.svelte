<script>
	import PostsList from '$lib/components/PostsList.svelte';
	import { siteDescription } from '$lib/config';
	import { base } from '$app/paths';

	/** @type {{data: any}} */
	let { data } = $props();
	const { categories, posts} = data;
</script>


<svelte:head>
	<title>Klettergebiete</title>
	<meta data-key="description" name="description" content={siteDescription}>
</svelte:head>

<div class="pt-50 h-screen max-w-3/4 justify-self-center">
	<div class="pb-10">
		<PostsList posts={posts} />
	</div>
</div>

<div class="bg-white border-1 border-gray-200 fixed h-36 left-0 right-0 top-0 shadow-md z-[500]"></div>
<div
	class="fixed w-screen h-fit no-scrollbar overflow-x-auto sm:w-auto sm:px-10 py-2 top-20 z-[1000]"
	style="
		 -webkit-mask:
    linear-gradient(to right, transparent 10%, #fff 15% 90%, transparent 95%),
    linear-gradient(to left, transparent 10%, #fff 15% 90%, transparent 95%);">
	<span class="px-4"></span>
	{#each categories as category}
		<a href="{base}/list/{category}"
			 class="cursor-pointer bg-white hover:shadow-xl font-semibold hover:bg-ink hover:text-white mb-2 text-sm me-2 p-2 px-4 rounded-full shadow-md items-center justify-center">{category}</a>
	{/each}
	<span class="px-4"></span>
</div>
