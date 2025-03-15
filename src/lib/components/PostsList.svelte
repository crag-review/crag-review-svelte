<script>
	import { base } from '$app/paths';

	export let posts = [];
</script>
<div class="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10 mb-5 pb-10">
	{#each posts as post}
		<a href="{base}/post/{post.slug}">
			<div class="max-w-sm cursor-pointer shadow-md rounded-xl hover:shadow-lg h-[450px]">
				<div class="rounded-t-xl h-60 bg-cover bg-center"
						 style="background-image: url({base}/images/small/{post.coverImage});"></div>
				<div class="p-5">
					<div>
						<h5 class="text-2xl font-bold tracking-tight overflow-hidden text-gray-900 mb-4 mt-2">{post.title}</h5>
					</div>
					<p class="font-normal overflow-show h-28"
						 style="-webkit-mask-image: linear-gradient(to bottom, white 0%, white 50%, transparent 90%);">
						{post.excerpt}
					</p>
				</div>
			</div>
		</a>
	{/each}
</div>
