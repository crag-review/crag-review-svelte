import fetchUniqueCategories from '$lib/assets/js/fetchUniqueCategories.js';
import fetchPosts from '$lib/assets/js/fetchPosts.js';

/** @type {import('./$types').PageServerLoad} */
export const load = async () => {
	const { posts } = await fetchPosts();
	const categories = await fetchUniqueCategories();
	const locations = posts.filter(value => !!value.location);

	return { categories, locations };
};
