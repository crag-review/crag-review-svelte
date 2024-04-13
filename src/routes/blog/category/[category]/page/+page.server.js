import { redirect } from '@sveltejs/kit';
import { base } from '$app/paths';

export const load = async () => {
	redirect(301, `${base}/blog/category`);
}
