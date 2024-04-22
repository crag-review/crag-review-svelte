<script>
	import { base } from '$app/paths';

	export let posts = []
</script>


<ul class="posts-list">
	{#each posts as post}
		<li>
			<article>
				<a href="{base}/blog/{post.slug}">
					<img
					src={base}{post.coverImage}
					alt=""
					width={post.coverWidth}
					height={post.coverHeight}
					style="ratio: {post.coverWidth} / {post.coverHeight}"
					/>
					<h2>
						{post.title}
					</h2>
				</a>
			</article>

			<p>{post.excerpt}</p>
		</li>
	{/each}
</ul>

<style>
	ul {
		display: flex;
		flex-wrap: wrap;
		gap: 50px;
		justify-content: center;
		}
	li {
		max-width: 300px;
	}
</style>