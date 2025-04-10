import fetchPosts from '$lib/assets/js/fetchPosts';

export const load = async ({ params }) => {
	const search = params.search;
	const options = { search, limit: -1 };
	const posts = await fetchPosts(options);

	return { posts, search };
};
