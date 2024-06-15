<script>
	export const prerender = false;
	export let locations = [];

	import { onMount, onDestroy } from 'svelte';

	let mapElement;
	let map;

	onMount(async () => {
		const leaflet = await import('leaflet');

		map = leaflet.map(mapElement).setView([48.2081, 16.3713], 9);

		leaflet
			.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
				attribution:
					'© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
			})
			.addTo(map);

		var climberIcon = L.icon({
			iconUrl: 'icons/climber.svg',
			iconSize: [30, 30], // size of the icon
		});

		locations.forEach((location) => {
			leaflet.marker(location, { icon: climberIcon }).addTo(map).bindPopup('<a href="asdf">climbing area</a>');
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
		height: 800px;
	}
</style>
