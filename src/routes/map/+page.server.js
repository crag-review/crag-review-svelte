import fetchPosts from '$lib/assets/js/fetchPosts.js';
import fetchUniqueCategories from '$lib/assets/js/fetchUniqueCategories.js';

/** @type {import('./$types').PageServerLoad} */
export const load = async ({ params }) => {
	const options = { limit: -1 };
	const { posts } = await fetchPosts(options);
	const categories = await fetchUniqueCategories();

	return { posts, categories };
};
