<script>
	import { siteAuthor } from '$lib/config';
	import NavItems from './NavItems.svelte';
	import { base } from '$app/paths';
</script>

<footer>
	<nav>
		<ul>
			<li>
				<a href="{base}/api/rss.xml" data-sveltekit-reload>RSS</a>
			</li>
			<li>
				<a href="{base}/">Home</a>
			</li>
		</ul>
	</nav>
	<nav>
		<NavItems />
	</nav>

	<p>&copy;{new Date().getFullYear()} {siteAuthor}</p>
</footer>
