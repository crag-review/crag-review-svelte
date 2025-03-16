<script>
	import { base } from '$app/paths';
	import {slide} from 'svelte/transition';

	export let locations = [];


	export let zoom = 8;
	export let center = [48, 16.0];
	export let onMarkerClicked;

	import { onMount, onDestroy } from 'svelte';

	let mapElement;
	let map;

	let satelliteTileLayer;
	let terrainTileLayer;
	let basicTileLayer;
	let tileLayerMenuOpen = false;

	if (!onMarkerClicked)
		onMarkerClicked = () => {
		};

	onMount(async () => {
		await import('leaflet');
		await import('leaflet-routing-machine');

		const gpsIcon = L.icon({ iconUrl: base + '/icons/gps.svg', iconSize: [40, 40] });
		const climberIcon = L.icon({ iconUrl: base + '/icons/climber.svg', iconSize: [40, 40] });
		const stopIcon = L.icon({ iconUrl: base + '/icons/stop.svg', iconSize: [40, 40] });

		satelliteTileLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
			attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
		});

		terrainTileLayer = L.tileLayer('https://tile.jawg.io/jawg-terrain/{z}/{x}/{y}{r}.png?access-token={accessToken}', {
			attribution: '<a href="https://jawg.io" title="Tiles Courtesy of Jawg Maps" target="_blank">&copy; <b>Jawg</b>Maps</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
			minZoom: 0,
			maxZoom: 22,
			accessToken: 'U5bdqKAQMXVq3eZ2U4EzDU4GnOCqcAxSlYWnrFvLzHVYojp6RqzS6UXT8PVGR1Y5'
		});

		basicTileLayer = L.tileLayer('https://tile.jawg.io/jawg-lagoon/{z}/{x}/{y}{r}.png?access-token={accessToken}', {
			attribution: '<a href="https://jawg.io" title="Tiles Courtesy of Jawg Maps" target="_blank">&copy; <b>Jawg</b>Maps</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
			minZoom: 0,
			maxZoom: 22,
			accessToken: 'U5bdqKAQMXVq3eZ2U4EzDU4GnOCqcAxSlYWnrFvLzHVYojp6RqzS6UXT8PVGR1Y5'
		});

		map = L.map(mapElement, {
			zoomControl: false,
			tap: !L.Browser.mobile,
			layers: [basicTileLayer]
		}).setView(center, zoom);

		map.on('zoomend', function() {
			if (map.getZoom() >= 10) {
				map.eachLayer((layer) => {
					if (layer instanceof L.Marker) {
						layer.openTooltip();
					}
				});
			} else {
				map.eachLayer((layer) => {
					if (layer instanceof L.Marker) {
						layer.closeTooltip();
					}
				});
			}
		});
		map.locate({ maxZoom: 8 });

		map.on('locationfound', function(e) {
			const radius = e.accuracy;
			L.marker(e.latlng, { icon: gpsIcon }).addTo(map);
			L.circle(e.latlng, radius).addTo(map);
		});

		locations.forEach((location) => {
			if (location.stop) {
				location.stop.forEach((stop) => {
					const routeControl = L.routing.control({
						router: L.Routing.mapbox('pk.eyJ1Ijoicm9iaW5zdGVpbmVyIiwiYSI6ImNtODc2M2hqZjBldHIybHNmOXVnNjNmYTQifQ.TDivv6iEKWnTbJowCn9MAg'),
						profile: 'foot',
						fitSelectedRoutes: false,
						waypoints: [stop.location, location.location],
						lineOptions: { styles: [{ color: '#12538b', opacity: 1, weight: 5 }] },
						createMarker: function() {
							return null;
						}
					}).addTo(map);
					routeControl.hide();
					L.marker(stop.location, { icon: stopIcon })
						.on('click', function() {
							onMarkerClicked();
							window.location.href = `${base}/post/${location.slug}`;
						})
						.addTo(map);
				});
			}
			L.marker(location.location, { icon: climberIcon })
				.on('click', function() {
					onMarkerClicked();
					window.location.href = `${base}/post/${location.slug}`;
				})
				.bindTooltip(location.title, { offset: [13, 0], permanent: true, direction: 'right' })
				.addTo(map);
		});

		map.eachLayer((layer) => {
			if (layer instanceof L.Marker) {
				layer.closeTooltip();
			}
		});
	});

	onDestroy(async () => {
		if (map) {
			map.remove();
		}
	});

	function removeTileLayers() {
		map.eachLayer((layer) => {
			if (layer instanceof L.TileLayer) {
				layer.remove();
			}
		});
	}

	function setBasicTileLayer() {
		removeTileLayers();
		basicTileLayer.addTo(map);
		tileLayerMenuOpen = false;
	}

	function setSatelliteTileLayer() {
		removeTileLayers();
		satelliteTileLayer.addTo(map);
		tileLayerMenuOpen = false;
	}

	function setTerrainTileLayer() {
		removeTileLayers();
		terrainTileLayer.addTo(map);
		tileLayerMenuOpen = false;
	}
</script>

<div class="sticky h-screen w-screen top-0 bottom-0 left-0 right-0" bind:this={mapElement}></div>
<div class='custom-popup' id='map'></div>
<div class="fixed sm:left-15 left-5 top-20 sm:top-22 z-[1000]" on:mouseleave={() => tileLayerMenuOpen = false}>
	<button class="cursor-pointer bg-white p-4 px-5 hover:text-white hover:bg-ink rounded-full border-1 border-gray-200 transition-all shadow-md"
					on:mouseenter={() => tileLayerMenuOpen = !tileLayerMenuOpen} class:rounded-b-none={tileLayerMenuOpen}><i class="fa-solid fa-layer-group"></i></button>
	{#if tileLayerMenuOpen}
		<div class="flex flex-col justify-center" in:slide={{duration: 200}} out:slide={{duration: 200}}>
			<button class="cursor-pointer p-3 py-2 hover:text-white hover:bg-ink bg-white border-1 border-gray-200"
							on:click={setBasicTileLayer}>
				<i class="fa-solid fa-bus-simple"></i>
			</button>
			<button class="cursor-pointer p-3 py-2 hover:text-white hover:bg-ink bg-white border-1 border-gray-200"
							on:click={setSatelliteTileLayer}>
				<i class="fa-solid fa-satellite"></i>
			</button>
			<button class="cursor-pointer p-3 py-2 hover:text-white hover:bg-ink bg-white border-1 border-gray-200 rounded-full rounded-t-none"
							on:click={setTerrainTileLayer}>
				<i class="fa-solid fa-mountain"></i>
			</button>
		</div>
	{/if}
</div>

<style>
    @import 'leaflet/dist/leaflet.css';
    @import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
</style>
