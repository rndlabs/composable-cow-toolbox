<script lang="ts">
	import WizardPage from '$lib/components/WizardPage.svelte';
	import Address from '$lib/components/web3/Address.svelte';
	import { chainId, signerAddress } from '$lib/store/chain';
	import { safe, fallbackHandler } from '$lib/store/safe';
	import { domainVerifier } from '$lib/store/cow';
	import { getDomainVerifier, isExtensibleFallbackHandler } from '@cowprotocol/cow-sdk';

	let domainVerifier: string | boolean | undefined;

	let handlerCheck =
		($fallbackHandler && $chainId && isExtensibleFallbackHandler($fallbackHandler, $chainId)) ||
		false;

	domainSeparator.subscribe(async (value) => {
		if (value && $signerAddress && $chainId && $rpc) {
			getDomainVerifier($signerAddress, value, $chainId, $rpc).then((verifier) => {
				console.log('domain verifier', verifier);
				domainVerifier = verifier;
			});
		}
	});
</script>

<WizardPage
	title="🐮🎶 Composable CoW Toolbox 🧰"
	leftButton={{ text: 'Back', uri: '/' }}
	rightButton={{ text: 'Next', uri: '/setup' }}
>
	<h2>Diagnostic Information</h2>
	{#if safe && signerAddress && $chainId}
		<div>
			<!-- Loop through the fixed information and display each item -->
			<div class="fixed-info-item">
				<strong>Safe Address:</strong>
				<span class="address-value-container">
					<Address address={$signerAddress} showExplorer={true} />
				</span>
			</div>
			{#if $safe}
				<div class="fixed-info-item">
					<strong>Fallback Handler:</strong>
					<span class="address-value-container">
						{#if $fallbackHandler}
							<Address address={$fallbackHandler} showExplorer={true} resolveEns={false} />
							<span class={handlerCheck ? 'extensible' : 'non-extensible'}>
								{#if handlerCheck}
									Extensible ✅
								{:else}
									Non-extensible ❌
								{/if}
							</span>
						{:else}
							Loading
						{/if}
					</span>
				</div>
				<div class="fixed-info-item">
					<strong><tt>GPv2Settlement</tt> domain verifier:</strong>
					<span class="address-value-container">
						{#if domainVerifier !== undefined}
							{#if domainVerifier}
								<Address address={String(domainVerifier)} showExplorer={true} resolveEns={false} />
								<span class="extensible">Extensible ✅</span>
							{:else}
								<span class="non-extensible">Non-extensible ❌</span>
							{/if}
						{:else}
							Loading
						{/if}
					</span>
				</div>
			{/if}
		</div>
	{/if}
</WizardPage>

<style>
	/* Styling for fixed information items */
	.fixed-info-item {
		margin-bottom: 1rem; /* Add margin at the bottom of each fixed information item */
		display: flex; /* Use flexbox for the fixed information items */
		align-items: center; /* Center align the items vertically */
	}

	strong {
		font-weight: bold;
	}

	.address-value-container {
		flex-grow: 1; /* Allow the address and value to take up available space */
		display: flex; /* Use flexbox for address and value */
		align-items: center; /* Center align address and value vertically */
	}

	.extensible,
	.non-extensible {
		padding: 4px 8px; /* Add padding to the extensible and non-extensible text */
		margin-left: 10px; /* Add spacing between the address and extensible text */
		border-radius: 4px; /* Rounded corners for extensible and non-extensible text */
		font-weight: bold; /* Bold text for extensible and non-extensible text */
	}

	/* Style for extensible text */
	.extensible {
		background-color: #d4edda; /* Light green background color for extensible */
		color: #155724; /* Dark green text color for extensible */
	}

	/* Style for non-extensible text */
	.non-extensible {
		background-color: #f8d7da; /* Light red background color for non-extensible */
		color: #721c24; /* Dark red text color for non-extensible */
	}
</style>
