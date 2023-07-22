<!-- QuoteForm.svelte -->
<script lang="ts">
	import { onMount } from 'svelte';
	import { BigNumber, utils } from 'ethers';
	import TokenField from './TokenField.svelte';
	import type { OrderQuoteRequest } from '@cowprotocol/cow-sdk';
	import { setError } from '$lib/store/error';
	import { init } from '$lib/store/tokens';

	// Define the type for the onSubmit prop function
	type OnSubmitHandler = (quoteRequest: OrderQuoteRequest) => void;

	export let onSubmit: OnSubmitHandler;
	let sellToken = '';
	let buyToken = '';
	let from = '';
	let receiver = '';
	let sellAmountBeforeFee = '';
	let buyAmountBeforeFee = '';
	let kind = 'sell';

	// Define the list of available tokens
	const availableTokens = [
		{
			value: '0xb4fbf271143f4fbf7b91a5ded31805e42b2208d6',
			label: 'WETH goerli'
		},
		{
			value: '0x02abbdbaaa7b1bb64b5c878f7ac17f8dda169532',
			label: 'GNO goerli'
		}
		// Add more tokens to the list as needed
	];

	const kinds = [
		'sell',
		'buy'
		// Add more kinds as needed
	];

	function handleKindChange(event: Event) {
		kind = (event.target as HTMLSelectElement).value;

		// Reset the sellAmountBeforeFee and buyAmountBeforeFee fields
		sellAmountBeforeFee = '';
		buyAmountBeforeFee = '';
	}

	function handleSubmit() {
		// Validate 'from' and 'receiver' as valid Ethereum addresses using ethers
		try {
			from = utils.getAddress(from);
			receiver = utils.getAddress(receiver);
		} catch (error) {
			setError('Please enter a valid Ethereum address.');
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
		} else {
			try {
				const bigNumberBuyAmount = BigNumber.from(buyAmountBeforeFee);
				if (bigNumberBuyAmount.lte(0)) {
					setError('Please enter a valid positive number for "Buy Amount Before Fee" field.');
					return;
				}
				buyAmountBeforeFee = bigNumberBuyAmount.toString(); // Normalize the BigNumber representation
			} catch (error) {
				setError('Please enter a valid positive number for "Buy Amount Before Fee" field.');
				return;
			}
		}

		const quoteRequest: OrderQuoteRequest = {
			sellToken,
			buyToken,
			from,
			receiver,
			sellAmountBeforeFee,
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
		<!-- Sell Token -->
		<div class="form-row">
			<label for="sellToken">Sell Token:</label>
			<TokenField tokens={availableTokens} bind:selectedToken={sellToken} />
		</div>

		<!-- Buy Token -->
		<div class="form-row">
			<label for="buyToken">Buy Token:</label>
			<TokenField tokens={availableTokens} bind:selectedToken={buyToken} />
		</div>

		<div class="form-row">
			<label for="from">From:</label>
			<input type="text" id="from" bind:value={from} required />
		</div>
		<div class="form-row">
			<label for="receiver">Receiver:</label>
			<input type="text" id="receiver" bind:value={receiver} required />
		</div>
		{#if kind === 'sell'}
			<div class="form-row">
				<label for="sellAmountBeforeFee">Sell Amount (before fee):</label>
				<input type="text" id="sellAmountBeforeFee" bind:value={sellAmountBeforeFee} required />
			</div>
		{:else}
			<div class="form-row">
				<label for="buyAmountBeforeFee">Buy Amount (before fee):</label>
				<input type="text" id="buyAmountBeforeFee" bind:value={buyAmountBeforeFee} required />
			</div>
		{/if}
		<div class="form-row">
			<label for="kind">Kind:</label>
			<select id="kind" bind:value={kind} on:change={handleKindChange} required>
				{#each kinds as k}
					<option value={k}>{k}</option>
				{/each}
			</select>
		</div>
		<div class="form-row">
			<button type="submit">Submit</button>
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
