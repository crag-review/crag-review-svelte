<script>
	import { base } from '$app/paths';
	import { Card, Button, Toggle } from 'flowbite-svelte';
	import { ArrowRightOutline } from 'flowbite-svelte-icons';

	export let posts = [];
</script>
<div class="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10 ...">

{#each posts as post}
		<Card img="{base}{post.coverImage}"  class="">
			<h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{post.title}</h5>
			<p class="mb-3 font-normal text-gray-700 dark:text-gray-400 leading-tight">{post.excerpt}</p>
			<Button href="{base}/blog/{post.slug}">
				Details <ArrowRightOutline class="w-6 h-6 ms-2 text-white" />
			</Button>
		</Card>
{/each}
</div>
