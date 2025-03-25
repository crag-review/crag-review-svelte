<script>
	import { base } from '$app/paths';
	import { slide } from 'svelte/transition';
	import maplibregl from 'maplibre-gl';
	import 'maplibre-gl/dist/maplibre-gl.css';
	import { onMount } from 'svelte';
	import { afterNavigate, goto } from '$app/navigation';

	afterNavigate((_navigation) => {
		fillLayers(locations)
		if(!location.hash) map.flyTo({ center, zoom, pitch })
	});

	/** @type {{locations?: any, zoom?: number, center?: any, pitch?: number}} */
	let {
		locations = [],
		zoom = 8,
		center = [16.0, 48],
		pitch = 60
	} = $props();

	let mapElement = $state();
	let map;
	let tileLayerMenuOpen = $state(false);
	let places;
	let routes;

	onMount(async () => {
		map = new maplibregl.Map({
			container: mapElement,
			zoom: zoom,
			center: center,
			pitch: 0,
			hash: true,
			style: base + '/transport.json',
			maxZoom: 18,
			maxPitch: 75
		});

		map.addControl(
			new maplibregl.GeolocateControl({
				positionOptions: {
					enableHighAccuracy: true
				},
				trackUserLocation: true
			})
		);

		map.getCanvas().style.cursor = "default"

		map.on('click', 'places', (e) => {
			goto(e.features[0].properties.link);
		});

		map.on('load', async () => {
			await drawLayers();
			map.on('styledata', async () => drawLayers());
		});

		map.on('mouseenter', 'places', function () {
				map.getCanvas().style.cursor = 'pointer';
		});

		map.on('mouseleave', 'places', function () {
			map.getCanvas().style.cursor = 'default';
		});

	});

	function fillLayers(locations) {
		places = {
			'type': 'FeatureCollection',
			'features': []
		};
		routes = {
			'type': 'FeatureCollection',
			'features': []
		};
		locations.forEach((location) => {
			if (location.stop) {
				location.stop.forEach(async (stop) => {
					addMarker(stop.location, 'stop', stop.name, `${base}/map/post/${location.slug}`);
					if (stop.route) await addRoute(stop.route);
				});
			}
			addMarker(location.location, 'climber', location.title, `${base}/map/post/${location.slug}`);
		});
		if (map?.loaded) drawLayers();
	}

	async function drawLayers() {
		map.addImage('climber', (await map.loadImage(base + '/icons/climber.png')).data);
		map.addImage('stop', (await map.loadImage(base + '/icons/stop.png')).data);
		map.getSource('places').setData(places);
		map.getSource('routes').setData(routes);
	}

	async function addRoute(file) {
		const route = await (await fetch(`${base}/geojson/${file}`)).json(); // stored in static folder
		routes.features = routes.features.concat(route.features);
	}

	function addMarker(location, icon, name, link) {
		places.features.push({
			'type': 'Feature',
			'geometry': {
				'type': 'Point',
				'coordinates': location
			},
			'properties': { name, icon, link }
		});
	}

	function setTransportTileLayer() {
		map.setStyle(base + '/transport.json');
		tileLayerMenuOpen = false;
	}

	function setSatelliteTileLayer() {
		map.setStyle(base + '/satellite.json');
		tileLayerMenuOpen = false;
	}

	function setTerrainTileLayer() {
		map.setStyle(base + '/terrain.json');
		tileLayerMenuOpen = false;
	}
</script>

<div class="sticky h-screen w-screen top-0 bottom-0 left-0 right-0" bind:this={mapElement}></div>
<div class="fixed sm:left-15 left-5 top-35 sm:top-37 z-[1000]" onmouseleave={() => tileLayerMenuOpen = false}>
	<button
		class="cursor-pointer bg-white p-3 px-4 sm:p-2 sm:px-3 hover:text-white hover:bg-ink rounded-full border-1 border-gray-200 transition-all shadow-md"
		onmouseenter={() => tileLayerMenuOpen = !tileLayerMenuOpen} class:rounded-b-none={tileLayerMenuOpen}><i
		class="fa-solid fa-layer-group"></i></button>
	{#if tileLayerMenuOpen}
		<div class="flex flex-col justify-center" in:slide={{duration: 200}} out:slide={{duration: 200}}>
			<button class="cursor-pointer p-3 py-2 hover:text-white hover:bg-ink bg-white border-1 border-gray-200"
							onclick={setTransportTileLayer}>
				<i class="fa-solid fa-bus-simple"></i>
			</button>
			<button class="cursor-pointer p-3 py-2 hover:text-white hover:bg-ink bg-white border-1 border-gray-200"
							onclick={setSatelliteTileLayer}>
				<i class="fa-solid fa-satellite"></i>
			</button>
			<button
				class="cursor-pointer p-3 py-2 hover:text-white hover:bg-ink bg-white border-1 border-gray-200 rounded-full rounded-t-none"
				onclick={setTerrainTileLayer}>
				<i class="fa-solid fa-mountain"></i>
			</button>
		</div>
	{/if}
</div>

<style>
    @import 'leaflet/dist/leaflet.css';
    @import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
    @import "tailwindcss";

    :global(.maplibregl-ctrl-top-right) {
        @apply fixed left-15 top-20 right-auto z-[1000];
    }

    :global(.maplibregl-ctrl-top-right) {
        @media (width <= 40rem) {
            @apply left-5 top-17;
        }
    }

    :global(.maplibregl-ctrl-group) {
        @apply cursor-pointer bg-white rounded-full border-1 border-gray-200 transition-all;
    }

    :global(.maplibregl-ctrl-group button) {
        @apply cursor-pointer bg-white rounded-full w-12 h-12;
    }

    :global(.maplibregl-ctrl-group button) {
        @media (width <= 40rem) {
            @apply w-13 h-13;
        }
    }

    :global(.maplibregl-ctrl-group:not(:empty)) {
        @apply shadow-md;
    }

    :global(.maplibregl-ctrl-bottom-right) {
        @apply bottom-2 right-2;
    }

    :global(.maplibregl-ctrl-bottom-right) {
        @media (width <= 40rem) {
            @apply bottom-18 right-2;
        }
    }
</style>
