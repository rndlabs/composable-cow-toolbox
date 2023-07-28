<!-- QuoteForm.svelte -->
<script lang="ts">
	import { onMount } from 'svelte';
	import { BigNumber, constants, utils } from 'ethers';
	import type { TokenInfo } from '@uniswap/token-lists';
	import type { OrderQuoteRequest } from '@cowprotocol/cow-sdk';
	import { setError } from '$lib/store/error';
	import { init, tokensOnThisChain } from '$lib/store/tokens';
	import { signerAddress } from '$lib/store/chain';
	import TokenField from './TokenField.svelte';

	// Define the type for the onSubmit prop function
	type OnSubmitHandler = (quoteRequest: OrderQuoteRequest) => void;

	export let onSubmit: OnSubmitHandler;
	let sellToken: TokenInfo;
	let buyToken: TokenInfo;
	let from = '';
	let receiver = constants.AddressZero;
	let sellAmountBeforeFee = '';
	let kind = 'sell';

	const kinds = [
		'sell',
		// TODO: 'buy'
		// Add more kinds as needed
	];

	function handleKindChange(event: Event) {
		kind = (event.target as HTMLSelectElement).value;

		// Reset the sellAmountBeforeFee and buyAmountBeforeFee fields
		sellAmountBeforeFee = '';
	}

	signerAddress.subscribe((address) => {
		from = address || '';
	});

	function handleSubmit() {
		// Validate 'from' and 'receiver' as valid Ethereum addresses using ethers
		try {
			receiver = utils.getAddress(receiver);
		} catch (error) {
			setError('Please enter a valid Ethereum address.');
			return;
		}

		// Validate 'sellToken' and 'buyToken' as valid TokenInfo objects
		if (!sellToken || !buyToken) {
			setError('Please select a valid token for both "Sell Token" and "Buy Token" fields.');
			return;
		}

		// Validate 'sellAmountBeforeFee' as a valid BigNumber using ethers
		if (kind === 'sell') {
			try {
				const bigNumberSellAmount = BigNumber.from(sellAmountBeforeFee);
				if (bigNumberSellAmount.lte(0)) {
					setError('Please enter a valid positive number for "Sell Amount Before Fee" field.');
					return;
				}
				sellAmountBeforeFee = bigNumberSellAmount.toString(); // Normalize the BigNumber representation
			} catch (error) {
				setError('Please enter a valid positive number for "Sell Amount Before Fee" field.');
				return;
			}
		}

		const quoteRequest: OrderQuoteRequest = {
			sellToken: sellToken.address,
			buyToken: buyToken.address,
			from,
			receiver,
			sellAmountBeforeFee: sellAmountBeforeFee.length > 0 ? BigNumber.from(sellAmountBeforeFee).mul(BigNumber.from(10).pow(sellToken.decimals)).toString() : '',
			kind: kind as OrderQuoteRequest['kind']
		};
		onSubmit(quoteRequest);
	}

	onMount(async () => {		
		// make sure the tokens are initialized
		init();
	});
</script>

<div>
	<form on:submit|preventDefault={handleSubmit}>
		<div class="form-row">
			<label for="kind">Order Kind:</label>
			<select id="kind" bind:value={kind} on:change={handleKindChange} required>
				{#each kinds as k}
					<option value={k}>{k}</option>
				{/each}
			</select>
		</div>
		<!-- Sell Token -->
		<div class="form-row">
			<TokenField label="Sell Token:" tokens={$tokensOnThisChain} bind:selectedToken={sellToken} />
		</div>

		<!-- Buy Token -->
		<div class="form-row">
			<TokenField label="Buy Token:" tokens={$tokensOnThisChain} bind:selectedToken={buyToken} />
		</div>

		<!-- <div class="form-row">
			<label for="from">From:</label>
			<input type="text" id="from" bind:value={from} required />
		</div>
		<div class="form-row">
			<label for="receiver">Receiver:</label>
			<input type="text" id="receiver" bind:value={receiver} required />
		</div> -->
		<div class="form-row">
			<label for="sellAmountBeforeFee">Sell Amount (before fee):</label>
			<input type="text" id="sellAmountBeforeFee" bind:value={sellAmountBeforeFee} required />
		</div>
		<div class="form-row">
			<button type="submit">Get Quote</button>
		</div>
	</form>
</div>

<style>
	/* Styling for form rows, labels, inputs, and button */
	.form-row {
		margin-bottom: 1rem; /* Add margin at the bottom of each form row */
	}

	label {
		display: block;
		margin-bottom: 0.25rem;
	}

	input,
	select {
		width: 100%;
		padding: 0.5rem;
		font-size: 1rem;
		box-sizing: border-box; /* Add this line */
	}

	button {
		padding: 0.75rem 1.5rem;
		font-size: 1rem;
		background-color: #007bff;
		color: #fff;
		border: none;
		cursor: pointer;
	}

	button:hover {
		background-color: #0056b3;
	}
</style>
