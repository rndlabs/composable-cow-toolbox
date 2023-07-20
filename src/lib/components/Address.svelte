<script lang="ts">
	import { safe, safeInfo } from '$lib/store/safe';
	import { formatAddress } from '$lib/utils';
	import { rpc } from '$lib/store/chain';
	import { SupportedChainId } from '@cowprotocol/cow-sdk';

	export let address: string;

	// lookup ens name
	$: ensOrAddress = async () => {
		if ($rpc && $safeInfo) {
			if ($safeInfo.chainId == SupportedChainId.MAINNET) {
				return await $rpc.lookupAddress(address);
			} else {
				return formatAddress(address);
			}
		} else {
			return 'Not connected';
		}
	};
</script>

<div class="user-address">
	{#if $safe && address}
		{#await ensOrAddress()}{formatAddress(address)}{:then name}{name}{/await}
	{:else}
		Connect Wallet
	{/if}
</div>
