/**
 * All of these values are used throughout the site – for example,
 * in the <meta> tags, in the footer, and in the RSS feed.
 *
 * PLEASE BE SURE TO UPDATE THEM ALL! Thank you!
 **/

export const siteTitle = 'Klettergebiete rund um Wien';
export const siteDescription = 'Finde Klettergebiete die von Wien aus öffentlich erreichbar sind';
export const siteLink = 'https://felsverzeichnis.vorstieg.eu/';

// Controls how many posts are shown per page on the main blog index pages
export const postsPerPage = 50;

// Edit this to alter the main nav menu. (Also used by the footer and mobile nav.)
export const navItems = [
	{
		title: 'Hauptseite',
		route: '/'
	},
	{
		title: 'Klettergebiete',
		route: '/blog'
	},
	{
		title: 'Impressum',
		route: '/about'
	}
];
