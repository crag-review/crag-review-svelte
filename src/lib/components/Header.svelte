<script>
	import { base } from '$app/paths';
	import { Navbar,NavBrand, NavHamburger, NavUl, NavLi} from 'flowbite-svelte';
	
</script>

<Navbar>
	<NavBrand href="/">
	  <img src="{base}/favicon.png" class="me-3 h-6 sm:h-9" alt="Felsverzeichnis Logo" />
	  <span class="self-center whitespace-nowrap text-xl font-semibold dark:text-white">Felsverzeichnis</span>
	</NavBrand>
	<NavHamburger  />
	<NavUl >
	  <NavLi href="{base}/">Hauptsite</NavLi>
	  <NavLi href="{base}/blog">Klettergebiete</NavLi>
	  <NavLi href="{base}/about">Impressum</NavLi>
	</NavUl>
  </Navbar>