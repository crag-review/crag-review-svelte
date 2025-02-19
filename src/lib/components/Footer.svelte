<script>
	import { base } from '$app/paths';
	import { Footer, FooterCopyright, FooterLinkGroup, FooterLink } from 'flowbite-svelte';

</script>

<Footer>
	<FooterLinkGroup ulClass="flex flex-wrap items-center mt-3 text-sm text-gray-500 dark:text-gray-400 sm:mt-0">
	  <FooterLink href="{base}/api/rss.xml">RSS</FooterLink>
	</FooterLinkGroup>
	<span>ein Projekt von <a href="https://www.vorstieg.eu">Vorstieg Software FlexCo</a></span>

</Footer>