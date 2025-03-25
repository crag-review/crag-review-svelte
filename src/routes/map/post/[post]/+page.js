import { error } from '@sveltejs/kit';
import { base } from '$app/paths';

export const prerender = false;

export const load = async ({ params, url }) => {
	try {
		const post = await import(`../../../../lib/posts/${params.post}.md`);
		return {
			zoom: post.metadata.zoom,
			center: post.metadata.location,
			locations: post.metadata.map,
			PostContent: post.default,
			meta: {
				...post.metadata,
				slug: params.post,
				lang: 'de',
				title: post.metadata.title + ' - Felsverzeichnis',
				description: post.metadata.excerpt,
				type: "article",
				author: 'Vorstieg Software FlexCo',
				image: base + '/src/lib/images/' + post.metadata.images[0],
				url: url.href
			}
		};
	} catch (err) {
		error(404, err);
	}
};
