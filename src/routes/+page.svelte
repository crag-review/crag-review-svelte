<script>
	import { base } from '$app/paths';
	import ClimbingMap from '$lib/components/ClimbingMap.svelte';
	import { siteTitle } from '$lib/config';
	import {Accordion, AccordionItem} from 'flowbite-svelte';

	export let data;

	const locations = data.posts.filter(value => !!value.location);
</script>

<svelte:head>
	<title>{siteTitle}</title>
</svelte:head>

<h1 class="text-4xl font-extrabold mt-4 ...">Klettergärten rund um Wien</h1>
In diesem Blog sammle ich Klettergebiete rund um Wien, die gut mit öffentlichen Verkehrsmitteln erreichbar sind.<br>

Sehr empfehlenswert ist auch der Mobilitätsguide des Alpenvereins: <a href="https://www.alpenverein.at/portal/natur-umwelt/sanfte_mobilitaet/Mobilitaetsguide-Sportklettern.php">Alpenverein</a><br>

Klettergärten: <a href="{base}/blog/category/sportklettern">Link</a><br>

Mehrseillängen: <a href="{base}/blog/category/Mehrseillängen">Link</a>

<Accordion>
	<AccordionItem open>
		<ClimbingMap {locations}></ClimbingMap>
	</AccordionItem>
</Accordion>
