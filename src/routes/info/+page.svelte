<script lang="ts">
	import CollapsableComponent from '$lib/components/CollapsableComponent.svelte';
	import Address from '$lib/components/web3/Address.svelte';
  import { rpc } from '$lib/store/chain';
  import { safe, safeInfo, signerAddress } from '$lib/store/safe';
	import { Safe, EthersAdapter } from '@rndlabs/safe-protocol-kit/dist/src/index';
  import { SafeAppProvider } from '@rndlabs/safe-apps-provider';
	import { onMount } from 'svelte';
  import { Signer, ethers, providers } from 'ethers'
	import { get } from 'svelte/store';

  let safeSdk: Safe | undefined;

  signerAddress.subscribe(async (address) => {
    if (!address) return;
    const ethAdaptor = new EthersAdapter({ethers, signerOrProvider: get(rpc)!});
    safeSdk = await Safe.create({safeAddress: address, ethAdapter: ethAdaptor})
  });
</script>

{#if safe}
<CollapsableComponent title="Safe Information">
	<div>
		<!-- Loop through the fixed information and display each item -->
    <div class="fixed-info-item">
      <strong>Safe Address:</strong>
      <span><Address address={$signerAddress} showExplorer={true} /></span>
    </div>
    {#if safeSdk}
    <div class="fixed-info-item">
      <strong>Fallback Handler:</strong>
      <span>
        {#await safeSdk?.getFallbackHandler()}
          Loading
        {:then handler}
          <Address address={handler} showExplorer={true} resolveEns={false} />
        {/await}
      </span>
    </div>
    {/if}
	</div>
</CollapsableComponent>
{/if}

<style>
	/* Styling for fixed information items */
	.fixed-info-item {
		margin-bottom: 1rem; /* Add margin at the bottom of each fixed information item */
	}

	strong {
		font-weight: bold;
	}

	span {
		display: block;
		margin-top: 0.25rem;
	}
</style>
