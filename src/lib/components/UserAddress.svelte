<!-- UserAddress.svelte -->
<script lang="ts">
	import { onMount } from 'svelte';
	import JazzIcon from './web3/JazzIcon.svelte';

	export let address = '';
	let resolvedAddress = '';
	let jazziconCanvas;

	onMount(() => {
		// Check if ENS is available
		const isENSAddress = address.includes('.');

		if (isENSAddress) {
			// If ENS is available, use the walletAddress as resolvedAddress
			resolvedAddress = address;
		} else {
			// If ENS is not available, use the first 4 and last 4 characters of the address with '0x' prefix
			resolvedAddress = `0x${address.slice(2, 6)}...${address.slice(-4)}`;
		}
	});
</script>

<div class="user-address-container">
    <!-- Display Jazzicon image -->
    <div><JazzIcon size={24} address={address} /></div>
  
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
  
    /* Set the width and height for the Jazzicon container */
    .jazzicon-canvas {
      width: 30px;
      height: 30px;
      display: inline-flex; /* Use inline-flex to align elements horizontally */
      margin-right: 10px;
    }
  
    /* Adjust the Jazzicon styling if needed */
    .jazzicon-canvas svg {
      width: 100%;
      height: 100%;
      border-radius: 50%;
    }
  
    /* Set the styling for the resolved address */
    .user-resolved-address {
      font-size: 14px;
      font-weight: bold;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  </style>