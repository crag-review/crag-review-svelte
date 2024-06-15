<script>
	import { siteAuthor } from '$lib/config';
	import { base } from '$app/paths';
	import { Footer, FooterCopyright, FooterLinkGroup, FooterLink } from 'flowbite-svelte';

</script>

<Footer>
	<FooterLinkGroup ulClass="flex flex-wrap items-center mt-3 text-sm text-gray-500 dark:text-gray-400 sm:mt-0">
	  <FooterLink href="{base}/api/rss.xml">RSS</FooterLink>
	</FooterLinkGroup>
	<FooterCopyright href="{base}/" by="{siteAuthor}" year={2024} />

</Footer>