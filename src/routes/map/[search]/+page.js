import fetchPosts from '$lib/assets/js/fetchPosts.js';

export const load = async ({ params }) => {
	let search = params.search;
	const options = { search, limit: -1 };
	const locations = await fetchPosts(options);

	return { locations, search, zoomToLocations: true };
};
