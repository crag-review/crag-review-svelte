import { redirect } from '@sveltejs/kit';
import { base } from '$app/paths';

export const load = () => {
	redirect(301, base + '/blog');
};
