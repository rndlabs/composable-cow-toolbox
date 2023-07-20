<!-- UserAddress.svelte -->
<script lang="ts">
	import { onMount } from 'svelte';
	import { createCanvas } from 'jazzicon';
	import { toChecksumAddress } from 'web3-utils'; // If you are using web3.js or ethers.js, otherwise omit this line

	export let walletAddress = '';
	let resolvedAddress = '';
	let jazziconCanvas;

	onMount(() => {
		// Check if ENS is available
		const isENSAddress = walletAddress.includes('.');

		if (isENSAddress) {
			// If ENS is available, use the walletAddress as resolvedAddress
			resolvedAddress = walletAddress;
		} else {
			// If ENS is not available, use the first 4 and last 4 characters of the address with '0x' prefix
			resolvedAddress = `0x${walletAddress.slice(2, 6)}...${walletAddress.slice(-4)}`;
		}

		// Generate Jazzicon for the user's Ethereum address
		const jazziconSize = 32; // Adjust the size of the Jazzicon (32 is a common size)
		jazziconCanvas = createCanvas(jazziconSize, toChecksumAddress(walletAddress) as unknown as number); // Adjust this line based on your address formatting
	});
</script>

<div class="user-address-container">
	<!-- Display Jazzicon image -->
	<div class="jazzicon-canvas" bind:this={jazziconCanvas} />

	<!-- Display resolved address (ENS or shortened address) -->
	<span class="user-resolved-address">{resolvedAddress}</span>
</div>

<style>
	.user-address-container {
		position: fixed;
		top: 10px;
		right: 10px;
		display: flex;
		align-items: center;
		background-color: #f9f9f9;
		border: 1px solid #ccc;
		border-radius: 5px;
		padding: 8px;
	}

	.user-avatar {
		width: 30px;
		height: 30px;
		border-radius: 50%;
		margin-right: 10px;
	}

	.jazzicon-canvas {
		width: 32px;
		height: 32px;
		margin-right: 10px;
	}

	.user-resolved-address {
		font-size: 14px;
		font-weight: bold;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
</style>
