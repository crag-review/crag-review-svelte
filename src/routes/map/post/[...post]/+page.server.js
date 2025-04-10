import { error } from '@sveltejs/kit';

export const load = async ({ params, url }) => {
	try {
		let transit, transitTrack, parking;

		const jsonFiles = import.meta.glob('$lib/entries/**/*.json');
		const crag = (await jsonFiles[`/src/lib/entries/${params.post}/${params.post.split('/').at(-1)}.json`]()).default;

		if (jsonFiles[`/src/lib/entries/${params.post}/${params.post.split('/').at(-1)}-transit.json`])
			 transit = (await jsonFiles[`/src/lib/entries/${params.post}/${params.post.split('/').at(-1)}-transit.json`]()).default;
		if (jsonFiles[`/src/lib/entries/${params.post}/${params.post.split('/').at(-1)}-transit-track.json`])
			 transitTrack = (await jsonFiles[`/src/lib/entries/${params.post}/${params.post.split('/').at(-1)}-transit-track.json`]()).default;
		if (jsonFiles[`/src/lib/entries/${params.post}/${params.post.split('/').at(-1)}-parking.json`])
			 parking = (await jsonFiles[`/src/lib/entries/${params.post}/${params.post.split('/').at(-1)}-parking.json`]()).default;

		return {
			path: params.post,
			zoom: 16,
			locations: [crag, transit, parking].filter( Boolean ),
			transit: transit?.geometry?.coordinates,
			parking: parking?.geometry?.coordinates,
			tracks: [transitTrack].filter( Boolean ),
			center: crag.geometry.coordinates,
			name: crag.properties.name,
			topo: crag.properties.topo,
			description: crag.properties.description,
			type: crag.properties.type,
			detailsShown: true,
			zoomToLocations: true,
			meta: {
				lang: 'de',
				title: crag.properties.name + ' - Felsverzeichnis',
				description: crag.properties.description,
				type: 'article',
				author: 'Vorstieg Software FlexCo',
				url: url.href
			}
		};
	} catch (err) {
		error(404, err);
	}
};
