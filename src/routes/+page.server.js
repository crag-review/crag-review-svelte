import { base } from '$app/paths';

/** @type {import('./$types').PageServerLoad} */
export const load = async ({ url, fetch }) => {
	const postRes = await fetch(`${url.origin}${base}/api/posts.json`);
	const posts = await postRes.json();

	return { posts };
};
