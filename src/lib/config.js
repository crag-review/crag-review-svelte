/**
 * All of these values are used throughout the site – for example, 
 * in the <meta> tags, in the footer, and in the RSS feed.
 * 
 * PLEASE BE SURE TO UPDATE THEM ALL! Thank you!
 **/ 

export const siteTitle = 'Crag Review'
export const siteDescription = 'List of climbing crags accessable by public transport'
export const siteURL = 'crag-review.github.io/crag-review'
export const siteLink = 'https://crag-review.github.io/crag-review'
export const siteAuthor = 'Benjamin Wieser'

// Controls how many posts are shown per page on the main blog index pages
export const postsPerPage = 10

// Edit this to alter the main nav menu. (Also used by the footer and mobile nav.)
export const navItems = [
	{
		title: 'Blog',
		route: '/blog'
	}, {
		title: 'About',
		route: '/about'
	}
]