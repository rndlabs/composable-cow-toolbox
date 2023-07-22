<script lang="ts">
	import WalletPill from './web3/WalletPill.svelte';
</script>

<div class="top-bar-container">
	<div class="nav-items-wrapper">
		<slot />
	</div>
	<WalletPill />
</div>

<style>
	/* Style for the container holding the entire component */
	.top-bar-container {
		position: fixed;
		top: 20px;
		right: 20px;
		display: flex;
		justify-content: space-between;
		align-items: center;
		width: calc(100% - 40px); /* Adjust the width to your needs */
	}

	/* Style for the nav-items wrapper */
	.nav-items-wrapper {
		/* Add centering styles as needed */
		display: flex;
		align-items: center;
		justify-content: center; /* Add this line to center align the nav items */
	}
</style>
