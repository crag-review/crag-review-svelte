<script>
	import ClimbingMap from '$lib/components/ClimbingMap.svelte';
	import { page } from "$app/state";
	/** @type {{children?: import('svelte').Snippet}} */
	let { children } = $props();
</script>

<ClimbingMap locations={page.data.locations} zoom={page.data.zoom} center={page.data.center}></ClimbingMap>
{@render children?.()}