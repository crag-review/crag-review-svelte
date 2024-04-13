<script>
	import { base } from '$app/paths';
	import { navItems } from '$lib/config';
	import NavItem from './NavItem.svelte';
</script>

<ul>
	{#each navItems as page}
		<NavItem href={base}/{page.route}>
			{page.title}
		</NavItem>
	{/each}
</ul>
