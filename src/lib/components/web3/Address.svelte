<script lang="ts">
	import { safe, safeInfo } from '$lib/store/safe';
	import { formatAddress } from '$lib/utils';
	import { rpc, chainId } from '$lib/store/chain';
	import { SupportedChainId } from '@cowprotocol/cow-sdk';
	import { EXPLORER_URLS } from '$lib/constants';

	export let address: string | undefined;
	export let showExplorer: boolean = false;
	export let resolveEns: boolean = true;

	// lookup ens name
	$: ensOrAddress = async () => {
		if ($rpc && $safeInfo && address) {
			if (resolveEns) {
				if ($safeInfo.chainId == SupportedChainId.MAINNET) {
					return (await $rpc.lookupAddress(address)) || formatAddress(address);
				} else {
					return formatAddress(address);
				}
			} else {
				return formatAddress(address);
			}
		} else {
			return 'Not connected';
		}
	};
</script>

<div class="link-container">
	{#if address}
		{#await ensOrAddress()}{formatAddress(address)}{:then name}{name}{/await}
		{#if showExplorer && $chainId && EXPLORER_URLS[$chainId]?.address}
			<a
				href={EXPLORER_URLS[$chainId]?.address(address) || '#'}
				target="_blank"
				rel="noopener noreferrer"
				class="explorer-link"
			>
				<img class="external-link-icon" src="/external-link.svg" alt="external link" />
			</a>
		{/if}
	{:else}
		Connect Wallet
	{/if}
</div>

<style>
	.link-container {
	  display: flex;
	  align-items: center; /* Align items vertically */
	}
  
	.external-link-icon {
	  width: 20px; /* Set the width of the image */
	  height: 20px; /* Set the height of the image */
	  margin-left: 5px; /* Add some margin on the left side of the image to create spacing between the text and the image */
	  /* You can adjust the width, height, and margin values as needed to achieve the desired appearance */
	}
  </style>
