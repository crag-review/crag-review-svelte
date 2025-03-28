<script>
	import { base } from '$app/paths';
	import { snapToBiggestHeight, resize } from './resize.js';
	import { afterNavigate } from '$app/navigation';

	const imagesModules = import.meta.glob(
		'$lib/images/*.{jpg,jpeg,png,gif,pdf}',
		{
			eager: true,
			query: {
				enhanced: true,
				w: '1280;640;400'
			}
		}
	);

	let fullscreenImage = $state();

	/** @type {{data: any}} */
	let { data } = $props();

	const { title, images, categories } = data.meta;
	const { PostContent } = data;

	afterNavigate((_navigation) => {
		if (location.hash) onMarkerClicked();
	});

	function onMarkerClicked() {
		if (snapToBiggestHeight) {
			snapToBiggestHeight();
		}
	}

	function getImage(name) {
		return imagesModules['/src/lib/images/' + name].default;
	}
</script>

{#if fullscreenImage}
	<div class="absolute top-0 bottom-0 left-0 right-0 z-[30000] bg-black opacity-70"></div>
	<div on:click={() => fullscreenImage = undefined}  class="absolute top-0 bottom-0 left-0 right-0 z-[30000] flex justify-center items-center">
		<enhanced:img class="self-center" src={fullscreenImage} />
	</div>
{/if}
<main class="z-[500] h-24">
	<div use:resize
			 class="box border-1 border-gray-200 fixed sm:left-auto left-0 right-0 mx-1 sm:!mx-2 sm:right-10 sm:!h-auto top-1/2 lg:!top-30 sm:!top-25 bottom-1 lg:!bottom-20 sm:!bottom-10 w-auto sm:w-[25rem] lg:w-[40rem] bg-white rounded-4xl sm:!rounded-3xl shadow-md z-[20000]">
		<div class="bg-gray-200 h-1 w-12 rounded-full justify-self-center mt-2 sm:hidden"></div>
		<a
			class="fixed right-5 sm:right-15 cursor-pointer bg-white w-10 h-10 pt-2.5 text-sm sm:mt-2 hover:text-white hover:bg-ink rounded-full border-1 text-center border-gray-200 transition-all ml-3 z-[5000]"
			href="{base}/map"><i class="fa-solid fa-xmark"></i></a>
		<div class="justify-self-center sm:justify-self-start w-screen sm:w-auto px-5 pr-20 flex flex-row pt-6 pb-5">
			<h1 class="text-2xl font-bold my-0 text-slate-800 sm:px-2">{title}</h1>
		</div>
		<div
			class="overflow-y-scroll w-screen sm:w-auto justify-self-center px-5 mb-36 sm:mb-26 overflow-x-hidden"
			style="height: -webkit-fill-available">
			{#if categories}
				<aside class="mb-5">
					{#each categories as category}
						<a href="{base}/map/{category}/"
							 class="bg-blue-100 hover:bg-blue-200 text-blue-800 text-sm font-semibold me-2 px-2.5 py-0.5 rounded-full border border-blue-400 inline-flex items-center justify-center">{category}</a>
					{/each}
				</aside>
			{/if}
			{#if images.length === 1}
				<enhanced:img on:click={() => fullscreenImage = getImage(images[0])}
											class="mx-auto h-48 object-cover rounded-md cursor-pointer" src={getImage(images[0])} />
			{:else}
				<div class="flex flex-col flex-wrap content-start h-73 overflow-x-auto no-scrollbar">
					{#each images as image ,i}
						{#if i === 0}
							<enhanced:img on:click={() => fullscreenImage = getImage(image)}
														class="w-60 h-71 mr-1.5 mb-1.5 rounded-2xl object-cover cursor-pointer"
														sizes="(min-width:1920px) 1280px, (min-width:1080px) 640px, (min-width:768px) 400px"
														src={getImage(image)} />
						{:else}
							<enhanced:img on:click={() => fullscreenImage = getImage(image)}
														class="w-34.5 h-34.5 mr-1.5 mb-1.5 rounded-2xl object-cover cursor-pointer"
														sizes="(min-width:1920px) 1280px, (min-width:1080px) 640px, (min-width:768px) 400px"
														src={getImage(image)} />
						{/if}
					{/each}
				</div>
			{/if}
			<div class="justify-center flex items-center mt-10 mb-10">
				<div class="prose text-slate-800">
					<PostContent />
				</div>
			</div>
		</div>
	</div>
</main>

<style>
    :global(.grabber.top) {
        height: 100px;
        width: 100%;
        position: absolute;
        top: -5px;
        cursor: pointer;
    }
</style>

