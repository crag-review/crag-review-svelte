<script>
	import { base } from '$app/paths';
	import ClimbingMap from '$lib/components/ClimbingMap.svelte';
	import { siteTitle } from '$lib/config';

	export let data;

	const locations = data.posts.filter(value => !!value.location);
</script>

<svelte:head>
	<title>{siteTitle}</title>
</svelte:head>
<div class="flex flex-col items-center justify-center lg:prose-xl mt-5 mb-5">
	<div>
		<h1 class="text-4xl font-extrabold mt-4">Klettergärten rund um Wien</h1>

		<p>Diese Plattform bietet eine Sammlung von Klettergebieten mit detaillierten Informationen zur öffentlichen Anreise.  
		Egal ob Anfänger*in oder erfahrene*r Kletterer*in – hier findest du passende Felsen für dein nächstes Abenteuer.</p>

		<p>Du möchtest ein neues Klettergebiet hinzufügen? Schau auf <a href="https://github.com/crag-review/crag-review-svelte">GitHub</a> vorbei!  
		Gemeinsam können wir die Kletter-Community unterstützen und nachhaltiges Klettern fördern.</p>

		<p>Sehr empfehlenswert: der <a class="font-medium text-blue-600 dark:text-blue-500 hover:underline" href="https://www.alpenverein.at/portal/natur-umwelt/sanfte_mobilitaet/Mobilitaetsguide-Sportklettern.php">Mobilitätsguide des Alpenvereins</a>,  
		der zeigt, wie du umweltfreundlich und ohne Auto zu den Kletterspots gelangst.</p>

		<h2 class="text-2xl font-bold mt-6">Mehr Informationen</h2>
		<ul>
		<li><strong>Klettergärten:</strong> <a class="font-medium text-blue-600 dark:text-blue-500 hover:underline" href="{base}/blog/category/sportklettern">Übersicht</a></li>
		<li><strong>Mehrseillängen:</strong> <a class="font-medium text-blue-600 dark:text-blue-500 hover:underline" href="{base}/blog/category/Mehrseillängen">Übersicht</a></li>
		</ul>

		<p>Viel Spaß beim Klettern und sichere Touren!</p>
	</div>

	<ClimbingMap {locations}></ClimbingMap>
</div>

