<script lang="ts">
	import { COMPOSABLE_COW_CONTRACT_ADDRESS, EXTENSIBLE_FALLBACK_HANDLER_CONTRACT_ADDRESS, OrderSigningUtils, createSetDomainVerifierTx } from '@cowprotocol/cow-sdk';
	import { chainId, signerAddress } from '$lib/store/chain';
	import type { TransactionBatch as TransactionBatchType } from '$lib/store/safe';
	import { fallbackHandler, safe, txMonitor, isExtensibleFallbackHandler } from '$lib/store/safe';
	import { isComposableCow } from '$lib/store/cow';
	import WizardPage from '$lib/components/WizardPage.svelte';
	import CheckboxWithLabel from '$lib/components/CheckboxWithLabel.svelte';
	import TransactionBatch from '$lib/components/web3/TransactionBatch.svelte';
	import { setError } from '$lib/store/error';

	let batch: TransactionBatchType = { txs: [] }

	// 1. If the fallback handler is not the ExtensibleFallbackHandler, add a transaction to upgrade it.
	let upgradeFallbackHandler = false;
	const upgradeFallbackHandlerCallback = async (checked: boolean) => {
		if (checked && $signerAddress) {
			const tx = await $safe?.createEnableFallbackHandlerTx(EXTENSIBLE_FALLBACK_HANDLER_CONTRACT_ADDRESS[$chainId!])
			if (!tx) {
				console.error('Failed to create transaction to upgrade fallback handler')
			}

			// Add a transaction to upgrade the fallback handler.
			batch.txs[batch.txs.length] = {
				description: 'Upgrade fallback handler to ExtensibleFallbackHandler',
				tx: tx?.data!,
				wipeRemaining: true
			};
		} else {
			// As all transactions within this flow are related to this one, we can just wipe the batch.
			batch.txs = [];

			// Also, as the fallback handler is not the ExtensibleFallbackHandler, we can't use the ComposableCoW.
			authoriseComposableCow = false;
		}
	};

	// 2. If the domain verifier is not the GPv2Settlement domain verifier, add a transaction to authorize it.
	let authoriseComposableCow = false;
	const authoriseComposableCowCallback = async (checked: boolean) => {
		if (checked && $chainId && $signerAddress) {
			// Add a transaction to authorize the domain verifier.
			batch.txs[batch.txs.length] = {
				description: 'Authorize ComposableCoW to sign orders for the GPv2Settlement domain',
				tx: {
					to: $signerAddress,
					value: '0',
					data: createSetDomainVerifierTx(OrderSigningUtils.getDomainSeparator($chainId), COMPOSABLE_COW_CONTRACT_ADDRESS[$chainId]),
				},
				wipeRemaining: false
			};
		} else {
			// In this case, it should be the last transaction in the batch, so we can just delete it.
			// But we can't use array operations to do this
			// (e.g. batch.txs.splice(batch.txs.length - 1, 1)) as the batch is a store.
			// Instead, we need to set the batch to a new object with the last transaction removed.
			batch = {
				txs: batch.txs.slice(0, batch.txs.length - 1)
			};
		}
	};

	// Configure the tx button logic
	const txButton = {
		text: 'Propose',
		disabled: false,
		handler: async () => {
			// If the batch is empty, don't do anything.
			if (batch.txs.length === 0) {
				return;
			}

			// Otherwise, let's use the txMonitor to propose the batch.
			try {
				await $txMonitor?.add(batch);
			} catch (e) {
				setError(e);
			}
		}
	};

	$: {
		// If the batch is empty, disable the tx button.
		txButton.disabled = batch.txs.length === 0;
	}
</script>

<WizardPage
	title="🐮🎶 Composable CoW Toolbox 🧰"
	leftButton={{ text: 'Back', uri: '/info' }}
	rightButton={{ text: 'Next', uri: '/setup' }}
	{txButton}
>
	<section slot="content">
		<h2>Setup your <tt>Safe</tt> for <tt>ComposableCoW</tt></h2>
		<div>
			In order to use the <tt>ComposableCoW</tt> Toolbox, you need to setup your <tt>Safe</tt> to use
			the <tt>ExtensibleFallbackHandler</tt> and the <tt>GPv2Settlement</tt> domain verifier.
		</div>
	
		{#if !$isExtensibleFallbackHandler}
			<CheckboxWithLabel bind:checked={upgradeFallbackHandler} handler={upgradeFallbackHandlerCallback}>
				<strong slot="whenChecked" class="whenChecked"
					>Upgrade fallback handler to <tt>ExtensibleFallbackHandler</tt></strong
				>
				<span slot="whenNotChecked" class="whenNotChecked"
					>Check this box to upgrade your fallback handler to support the <tt>ComposableCoW</tt> conditional
					order framework.</span
				>
			</CheckboxWithLabel>
		{/if}
	
		{#if !$isComposableCow && ($isExtensibleFallbackHandler || (upgradeFallbackHandler && batch.txs.length > 0))}
			<CheckboxWithLabel bind:checked={authoriseComposableCow} handler={authoriseComposableCowCallback}>
				<strong slot="whenChecked" class="whenChecked"
					>Authorise <tt>ComposableCoW</tt> to sign orders for the <tt>GPv2Settlement</tt> domain.</strong
				>
				<span slot="whenNotChecked" class="whenNotChecked"
					>Check this box to authorise <tt>ComposableCoW</tt> to sign orders for the
					<tt>GPv2Settlement</tt> domain.</span
				>
			</CheckboxWithLabel>
		{/if}
	</section>

	<section slot="footer">
		{#if batch.txs.length > 0}
			<TransactionBatch bind:batch />
		{/if}
	</section>
</WizardPage>

<style>
	/* Slot styles for when the checkbox is checked */
	.whenChecked {
		color: #2ecc71; /* Tasteful green */
	}

	/* Slot styles for when the checkbox is not checked */
	.whenNotChecked {
		color: #f39c12; /* Tasteful amber */
	}
</style>
