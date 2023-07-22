<script lang="ts">
	import CollapsableComponent from '$lib/components/CollapsableComponent.svelte';
	import Address from '$lib/components/web3/Address.svelte';
  import { safe, signerAddress } from '$lib/store/safe';
</script>

{#if safe}
<CollapsableComponent title="Safe Information">
	<div>
		<!-- Loop through the fixed information and display each item -->
    <div class="fixed-info-item">
      <strong>Safe Address:</strong>
      <span><Address address={$signerAddress} showExplorer={true} /></span>
    </div>
    {#if $safe}
    <div class="fixed-info-item">
      <strong>Fallback Handler:</strong>
      <span>
        {#await $safe?.getFallbackHandler()}
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
