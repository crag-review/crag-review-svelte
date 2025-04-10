import { postsPerPage } from '$lib/config';

const fetchPosts = async ({ offset = 0, limit = postsPerPage, search = '' } = {}) => {
	const posts = await Promise.all(
		Object.entries(
			import.meta.glob([
				'$lib/entries/**/*.json',
				'!$lib/entries/**/*-transit*.json',
				'!$lib/entries/**/*-parking*.json'
			])
		).map(async ([path, resolver]) => {
			const data = (await resolver()).default;
			data.properties.path = path.split('/').slice(4, -1).join('/');
			return data;
		})
	);

	let sortedPosts = posts.sort((a, b) => new Date(b.properties.date) - new Date(a.properties.date));

	if (search) {
		sortedPosts = sortedPosts.filter(
			(post) =>
				post.properties.name.toLowerCase().includes(search.toLowerCase()) || post.properties.type.includes(search) || post.properties.path.toLowerCase().includes(search.toLowerCase())
		);
	}

	if (offset) {
		sortedPosts = sortedPosts.slice(offset);
	}

	if (limit && limit < sortedPosts.length && limit !== -1) {
		sortedPosts = sortedPosts.slice(0, limit);
	}

	return sortedPosts;
};

export default fetchPosts;
