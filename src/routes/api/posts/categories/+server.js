import { json } from '@sveltejs/kit';
import fetchUniqueCategories from '$lib/assets/js/fetchUniqueCategories.js';

export const prerender = true;

export const GET = async () => {
	const { posts } = await fetchUniqueCategories();

	return json(posts);
};
