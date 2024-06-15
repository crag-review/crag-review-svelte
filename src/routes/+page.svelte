<script>
	import ClimbingMap from '$lib/components/ClimbingMap.svelte';
	import { siteTitle } from '$lib/config';
	import {Accordion, AccordionItem} from 'flowbite-svelte';

	export let data;

	const locations = [
		[48.2081, 16.3713],
		[48.2081, 16.372]
	];
</script>

<svelte:head>
	<title>{siteTitle}</title>
</svelte:head>

<!-- This is the README.md file in the root of the repo. It serves double duty as the homepage's content. If you'd rather use your own HTML and/or Svelte, you can delete/modify everything in this file. -->
<svelte:component this={data.ReadMe} />

<Accordion>
	<AccordionItem open>
		<ClimbingMap {locations}></ClimbingMap>
	</AccordionItem>
</Accordion>
