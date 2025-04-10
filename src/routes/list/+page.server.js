import fetchPosts from '$lib/assets/js/fetchPosts.js';

export const load = async () => {
	// TODO: reimplement pagination if performance issues arise
	const posts = await fetchPosts();
	return { posts };
};
