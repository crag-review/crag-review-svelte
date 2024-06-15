<script>
	import { Navbar, NavBrand, NavLi, NavUl, NavHamburger } from 'flowbite-svelte';
	import { base } from '$app/paths';

  </script>

<Navbar  >
	<NavBrand href="/">
	  <img src="{base}/favicon.png" class="me-3 h-6 sm:h-9" alt="Crag Review Logo" />
	  <span class="self-center whitespace-nowrap text-xl font-semibold dark:text-white">Crag Review</span>
	</NavBrand>
	<NavHamburger  />
	<NavUl >
	  <NavLi href="{base}">Hauptsite</NavLi>
	  <NavLi href="{base}/blog">Klettergebiete</NavLi>
	  <NavLi href="{base}/about">Impressum</NavLi>
	</NavUl>
  </Navbar>