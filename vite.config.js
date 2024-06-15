import { sveltekit } from '@sveltejs/kit/vite'
import tailwindcss from 'tailwindcss';

/** @type {import('vite').UserConfig} */
const config = {
	plugins: [sveltekit(), tailwindcss()],
	server: {
		fs: {
			allow: ['.']
		}
	}
};

export default config
