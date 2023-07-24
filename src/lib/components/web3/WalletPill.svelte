<script lang="ts">
	import { signerAddress } from '$lib/store/chain';

	import Address from '$lib/components/web3/Address.svelte';
	import JazzIcon from '$lib/components/web3/JazzIcon.svelte';
</script>

<div class="address-container">
	<div class="jazzicon-container">
		<JazzIcon size={24} address={$signerAddress} />
	</div>
	<Address address={$signerAddress} />
</div>

<style>
	.address-container {
		/* Align center vertically */
		display: flex;
		align-items: center;

		/* Add background color, border radius, padding, and box shadow */
		background-color: #f9f9f9;
		border-radius: 25px;
		padding: 8px 16px;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

		/* Add margin to position the address container */
		margin-right: 20px;
	}

	.jazzicon-container {
		/* Adjust padding and margin-right */
		padding: 0.3em;
		margin-right: 8px;
	}
</style>
