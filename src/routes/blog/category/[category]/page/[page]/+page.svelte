<!-- Renders posts listed by category -->
<script>
	import PostsList from '$lib/components/PostsList.svelte'
	import Pagination from '$lib/components/Pagination.svelte'
	import { siteDescription, postsPerPage } from '$lib/config'
	import { base } from '$app/paths';

	export let data
	const { page, category, totalPosts, posts } = data 

	$: lowerBound = (page * postsPerPage) - (postsPerPage - 1) || 1
	$: upperBound = Math.min(page * postsPerPage, totalPosts)
</script>


<svelte:head>
	<title>{category}  {page}</title>
	<meta data-key="description" name={siteDescription}>
</svelte:head>


<!-- TODO: this is duplicated across multiple `+page.svelte` files -->
{#if posts && posts.length}
	<h1>
		Kategorie: {category}
		<br />
		<small>Posts {lowerBound}–{upperBound} of {totalPosts}</small>
	</h1>
	<Pagination currentPage={page} {totalPosts} path="{base}/blog/category/{category}/page" />

	<PostsList {posts} />

	<Pagination currentPage={page} {totalPosts} path="{base}/blog/category/{category}/page" />
{:else}
	<h1>Oops!</h1>

	<p>Sorry, no posts to show here.</p>

	<a href="{base}/blog">Back to blog</a>
{/if}