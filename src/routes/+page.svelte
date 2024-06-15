<script>
	import ClimbingMap from '$lib/components/ClimbingMap.svelte';
	import { siteTitle } from '$lib/config';
	import {Accordion, AccordionItem} from 'flowbite-svelte';

	export let data;

	const locations = data.posts.filter(value => !!value.location);
</script>

<svelte:head>
	<title>{siteTitle}</title>
</svelte:head>


<Accordion>
	<AccordionItem open>
		<ClimbingMap {locations}></ClimbingMap>
	</AccordionItem>
</Accordion>
