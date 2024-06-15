import { postsPerPage } from '$lib/config';
import fetchPosts from '$lib/assets/js/fetchPosts';
import { redirect } from '@sveltejs/kit';
import { base } from '$app/paths';

export const load = async ({ url, params, fetch }) => {
	const page = parseInt(params.page) || 1;

	// Keeps from duplicationg the blog index route as page 1
	if (page <= 1) {
		redirect(301, base + '/blog');
	}

	let offset = page * postsPerPage - postsPerPage;

	const totalPostsRes = await fetch(`${url.origin}${base}/api/posts/count`);
	const total = await totalPostsRes.json();
	const { posts } = await fetchPosts({ offset, page });

	return {
		posts,
		page,
		totalPosts: total
	};
};
