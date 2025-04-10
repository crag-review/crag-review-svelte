import fetchPosts from '$lib/assets/js/fetchPosts.js';

/** @type {import('./$types').PageServerLoad} */
export const load = async () => {
	const locations = await fetchPosts();
	return { locations };
};
