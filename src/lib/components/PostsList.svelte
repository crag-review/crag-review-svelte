<script>
	import { base } from '$app/paths';

	/** @type {{posts?: any}} */
	let { posts = [] } = $props();

	const imageFiles = import.meta.glob(
		'$lib/entries/**/*.{jpg,jpeg,png,gif,pdf}',
		{
			eager: true,
			query: {
				enhanced: true,
				w: '1280;640;400'
			}
		}
	);

	function getImage(path) {
		return Object.entries(imageFiles).filter(([key]) => new RegExp(`^/src/lib/entries/${path}/.*$`).test(key)).map(([, value]) => value)[0]?.default;
	}
</script>
<div class="grid md:grid-cols-2 lg:grid-cols-3 gap-10 mb-5 pb-10">
	{#each posts as post}
		<a href="{base}/map/post/{post.properties.path}">
			<div class="max-w-sm cursor-pointer shadow-md rounded-xl hover:shadow-lg h-[450px]">
				{#if getImage(post.properties.path)}
					<enhanced:img class="rounded-t-xl h-60 object-cover"
												sizes="(min-width:1920px) 1280px, (min-width:1080px) 640px, (min-width:768px) 400px"
												src={getImage(post.properties.path)} />
				{/if}
				<div class="p-5">
					<div>
						<h5
							class="text-2xl font-bold tracking-tight overflow-hidden text-gray-900 mb-4 mt-2">{post.properties.name}</h5>
					</div>
					<p class="font-normal overflow-show h-28"
						 style="-webkit-mask-image: linear-gradient(to bottom, white 0%, white 50%, transparent 90%);">
						{post.properties.description}
					</p>
				</div>
			</div>
		</a>
	{/each}
</div>
