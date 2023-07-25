<script lang="ts">
	import WizardPage from '$lib/components/WizardPage.svelte';
	import Address from '$lib/components/web3/Address.svelte';
	import { chainId, signerAddress } from '$lib/store/chain';
	import { safe, fallbackHandler } from '$lib/store/safe';
	import { domainVerifier } from '$lib/store/cow';
	import { isExtensibleFallbackHandler, isComposableCoW } from '@cowprotocol/cow-sdk';

	let handlerCheck =
		($fallbackHandler && $chainId && isExtensibleFallbackHandler($fallbackHandler, $chainId)) ||
		false;

	let composableCowCheck = false;

	$: {
		$domainVerifier.then((verifier) => {
			composableCowCheck = ($chainId && verifier && isComposableCoW(verifier, $chainId)) || false;
		});
	}
</script>

<WizardPage
	title="🐮🎶 Composable CoW Toolbox 🧰"
	leftButton={{ text: 'Back', uri: '/' }}
	rightButton={{ text: 'Next', uri: '/setup' }}
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
								<span class={handlerCheck ? 'extensible' : 'non-extensible'}>
									{#if handlerCheck}
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
							{#if domainVerifier !== undefined}
								{#if composableCowCheck}
									<Address
										address={String(domainVerifier)}
										showExplorer={true}
										resolveEns={false}
									/>
									<span class="extensible"><tt>ComposableCoW</tt> ✅</span>
								{:else if handlerCheck}
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
