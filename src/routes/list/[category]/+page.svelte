<script>
	import PostsList from '$lib/components/PostsList.svelte';
	import { base } from '$app/paths';

	/** @type {{data: any}} */
	let { data } = $props();

	const { posts, activeCategory } = data;
</script>


<svelte:head>
	<title>  Kategorie: {activeCategory}</title>
</svelte:head>
<div class="pt-50 h-screen  max-w-3/4 justify-self-center">

	{#if posts.length}
		<div class="pb-10">
			<PostsList posts={posts} />
		</div>
	{:else}
		<p> Sorry, couldn't find any posts in the category "{activeCategory}".</p>
	{/if}
</div>

<div class="bg-white border-1 border-gray-200 fixed h-36 left-0 right-0 top-0 shadow-md z-[500]"></div>
<div class="h-fit fixed w-full sm:w-auto bottom-0 sm:bottom-auto p-2 left-5 sm:left-15 top-18 sm:top-19 z-[1000]">
	<div
		class="cursor-pointer shadow-lg font-semibold text-white bg-ink mb-2 text-sm me-2 p-2 px-4 rounded-full inline-flex items-center justify-center">{activeCategory}</div>
	<a href="{base}/list"
		 class="cursor-pointer bg-white hover:shadow-xl font-semibold hover:bg-ink hover:text-white mb-2 text-sm me-2 p-3 px-4 rounded-full shadow-md inline-flex items-center justify-center"><i class="fa-solid fa-close"></i></a>
</div>