<script lang="ts">
	import WizardPage from '$lib/components/WizardPage.svelte';
	import Address from '$lib/components/web3/Address.svelte';
	import { chainId, signerAddress } from '$lib/store/chain';
	import {
		safe,
		fallbackHandler,
		isExtensibleFallbackHandler,
		type TransactionBatch,
		txMonitor
	} from '$lib/store/safe';
	import { domainVerifier, isComposableCow } from '$lib/store/cow';
	import { OrderSigningUtils, createSetDomainVerifierTx } from '@cowprotocol/cow-sdk';
	import { constants } from 'ethers';
	import { setError } from '$lib/store/error';

	let txButton: any;

	$: {
		txButton =
			$isExtensibleFallbackHandler && $isComposableCow
				? {
						text: 'Reset',
						disabled: false,
						handler: async () => {
							// Reset the fallback handler and domain verifier.
							if ($safe) {
								const tx = await $safe.createEnableFallbackHandlerTx('0xf48f2B2d2a534e402487b3ee7C18c33Aec0Fe5e4');
								if (tx && $signerAddress && $chainId) {
									const batch: TransactionBatch = {
										txs: [
											{
												// We must do this step before we reset the fallback handler.
												// Otherwise we will not be able to do it afterwards.
												description: 'Reset the domain verifier to Safe default (nothing)',
												tx: {
													to: $signerAddress,
													value: '0',
													data: createSetDomainVerifierTx(
														OrderSigningUtils.getDomainSeparator($chainId),
														constants.AddressZero
													)
												},
												wipeRemaining: true
											},
											{
												description: 'Reset fallback handler to Safe default',
												tx: {
													to: $signerAddress,
													value: '0',
													data: tx?.data.data
												},
												wipeRemaining: false
											}
										]
									};

									try {
										await $txMonitor?.add(batch);
									} catch (e) {
										setError(e);
									}
								}
							}
						}
				  }
				: undefined;
	}
</script>

<WizardPage
	title="🐮🎶 Composable CoW Toolbox 🧰"
	leftButton={{ text: 'Back', uri: '/' }}
	rightButton={{ text: 'Next', uri: '/setup' }}
	{txButton}
>
	<section slot="content">
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
								<span class={$isExtensibleFallbackHandler ? 'extensible' : 'non-extensible'}>
									{#if $isExtensibleFallbackHandler}
										Extensible ✅
									{:else}
										<tt>ExtensibleFallbackHandler</tt> not configured ❌
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
							{#if $domainVerifier}
								{#if $isComposableCow}
									<Address address={$domainVerifier} showExplorer={true} resolveEns={false} />
									<span class="extensible"><tt>ComposableCoW</tt> ✅</span>
								{:else if $isExtensibleFallbackHandler}
									<span class="non-extensible"><tt>ComposableCoW</tt> not authorized ❌</span>
								{:else}
									<span class="non-extensible"
										><tt>ExtensibleFallbackHandler</tt> not configured ❌</span
									>
								{/if}
							{:else}
								Loading
							{/if}
						</span>
					</div>
				{/if}
			</div>
		{/if}
	</section>
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
