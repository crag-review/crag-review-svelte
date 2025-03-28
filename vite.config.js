import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from "@tailwindcss/vite";
import { enhancedImages } from '@sveltejs/enhanced-img';


/** @type {import('vite').UserConfig} */
const config = {
	plugins: [enhancedImages(), sveltekit(), tailwindcss()],
	server: {
		fs: {
			allow: ['.']
		}
	}
};

export default config;
