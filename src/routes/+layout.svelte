<script lang="ts">
	import { hasError } from '$lib/store/error';

	import ErrorModal from '$lib/components/ErrorModal.svelte';
	import Connect from '$lib/components/web3/Connect.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import TopBar from '$lib/components/TopBar.svelte';

	export const ssr = false;
</script>

<Connect>
	<TopBar>
		<div class="navbar">
			<!-- <a href="/" class="nav-item">Home</a>
			<a href="/info" class="nav-item">Safe Info</a>
			<a href="/setup" class="nav-item">Setup</a>
			<a href="/simple-swap" class="nav-item">Off-chain Signing</a>
			<a href="/conditional-order" class="nav-item">Create Conditional Order</a>
			<a href="/multi-conditional-order" class="nav-item">Multi Conditional Order</a> -->
		</div>
	</TopBar>
	<main>
		<slot />
	</main>
	<Footer />

	{#if $hasError}
		<!-- Show the ErrorModal if the modal is open -->
		<ErrorModal />
	{/if}
</Connect>

<style>
	/* Reset default styles and apply box-sizing */
	* {
		margin: 0;
		padding: 0;
		box-sizing: border-box;
	}

	/* Center the form on the page */
	main {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 100vh;
		overflow: hidden; /* Hide any overflow from the form-container */
	}

	/* Navbar item (pill-like button) */
	.nav-item {
		border: none;
		border-radius: 25px; /* Make it a pill shape */
		padding: 0.75rem 1.5rem; /* Adjust padding to create the button size */
		margin: 0 0.25rem; /* Add margin between the buttons */
		font-size: 1rem;
		font-weight: bold;
		color: #fff;
		background-color: #007bff; /* Set background color to blue */
		cursor: pointer;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2); /* Add shadow */
		transition: background-color 0.2s ease-in-out; /* Add transition effect on hover */
	}

	/* Hover effect */
	.nav-item:hover {
		background-color: #0056b3; /* Change background color on hover */
	}
</style>
