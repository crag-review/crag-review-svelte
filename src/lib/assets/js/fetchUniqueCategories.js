import fetchPosts from '$lib/assets/js/fetchPosts.js';

export const fetchUniqueCategories = async () => {
	const { posts } = await fetchPosts({ limit: -1 }); // Fetch all posts by setting limit to -1

	if (!posts) {
		return []; // Return empty array if there are no posts
	}

	const uniqueCategoriesSet = new Set(); // Removed <string> type annotation

	for (const post of posts) {
		if (post.categories && Array.isArray(post.categories)) { // Ensure categories exist and is an array
			for (const category of post.categories) {
				uniqueCategoriesSet.add(category);
			}
		}
	}

	const uniqueCategories = Array.from(uniqueCategoriesSet); // Convert Set to Array
	return uniqueCategories;
};

export default fetchUniqueCategories;
