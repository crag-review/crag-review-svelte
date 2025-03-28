import fetchPosts from '$lib/assets/js/fetchPosts.js';

export const load = async ({ params, parent }) => {
	const activeCategory = params.category;
	const options = { category: activeCategory, limit: -1 };
	const { posts } = await fetchPosts(options);
	const locations = posts.filter(value => !!value.location);

	return { locations, activeCategory };
};
