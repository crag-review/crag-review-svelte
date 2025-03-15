import fetchPosts from '$lib/assets/js/fetchPosts';

export const load = async ({ params }) => {
	const activeCategory = params.category;
	const options = { category: activeCategory, limit: -1 };
	const { posts } = await fetchPosts(options);

	return {
		posts,
		activeCategory
	};
};
