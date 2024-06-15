<script>
	export const prerender = false;
	export let locations = [];

	import { onMount, onDestroy } from 'svelte';

	let mapElement;
	let map;

	onMount(async () => {
		console.log(locations)

		const leaflet = await import('leaflet');

		map = leaflet.map(mapElement).setView([48, 16.0], 8);

		leaflet
			.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
				attribution:
					'© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
			})
			.addTo(map);

		var climberIcon = L.icon({
			iconUrl: 'icons/climber.svg',
			iconSize: [40, 40], // size of the icon
		});

		locations.forEach((location) => {
			leaflet.marker(location.location, { icon: climberIcon }).addTo(map).bindPopup(`<a href="./blog/${location.slug}">${location.title}</a>`);
		});
	});

	onDestroy(async () => {
		if (map) {
			console.log('Unloading Leaflet map.');
			map.remove();
		}
	});
</script>

<main>
	<div bind:this={mapElement}></div>
</main>

<style>
	@import 'leaflet/dist/leaflet.css';
	main div {
		height: 600px;
	}
</style>
