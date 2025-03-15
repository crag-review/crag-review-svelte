import fetchUniqueCategories from '$lib/assets/js/fetchUniqueCategories.js';
import { postsPerPage } from '$lib/config.js';
import fetchPosts from '$lib/assets/js/fetchPosts.js';

export const load = async ({ url, fetch, params }) => {
	const page = parseInt(params.page) || 1;

	let offset = page * postsPerPage - postsPerPage;
	const activeCategory = url.searchParams.get('category');

	const totalPostsRes = await fetch('/api/posts/count');
	const total = await totalPostsRes.json();
	const { posts } = await fetchPosts({ offset, page, category: activeCategory });

	const categories = await fetchUniqueCategories();

	return { posts, page, total, categories, activeCategory };
};
