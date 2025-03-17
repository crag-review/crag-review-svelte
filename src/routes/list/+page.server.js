import fetchUniqueCategories from '$lib/assets/js/fetchUniqueCategories.js';
import fetchPosts from '$lib/assets/js/fetchPosts.js';

export const load = async () => {
	// TODO: reimplement pagination if performance issues arise
	const { posts } = await fetchPosts();

	const categories = await fetchUniqueCategories();

	return { posts, categories };
};
