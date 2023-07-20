<script lang="ts">
	import { onMount } from 'svelte';
	import { createEventDispatcher } from 'svelte';
	import { providers } from 'ethers';
	import {
		OrderBookApi,
		OrderQuoteSide,
		OrderSigningUtils,
		SupportedChainId
	} from '@cowprotocol/cow-sdk';

    import SafeAppsSDK from '@safe-global/safe-apps-sdk'

	import QuoteForm from '$lib/components/QuoteForm.svelte';

	type Opts = {
		allowedDomains?: RegExp[];
		debug?: boolean;
	};

	const opts: Opts = {
		allowedDomains: [/gnosis-safe.io$/, /app.safe.global$/],
		debug: false
	};

	const appsSdk = new SafeAppsSDK(opts);

	onMount(async () => {
		// await main();
	});

	const account = '0xE618050F1adb1F6bb7d03A3484346AC42F3E71EE';
	const chainId = 5; // Goerli
	const provider = new providers.JsonRpcProvider(
		'https://eth-goerli.gateway.pokt.network/v1/lb/62bac829123e6f0039896650'
	);
	const signer = provider.getSigner();

	const orderBookApi = new OrderBookApi({ chainId: SupportedChainId.GOERLI });

	async function main() {
		const { quote } = await orderBookApi.getQuote(quoteRequest);

		console.log('Quote: ', quote);

		// const orderSigningResult = await OrderSigningUtils.signOrder(quote, chainId, signer)

		// const orderId = await orderBookApi.sendOrder({ ...quote, ...orderSigningResult })

		// const order = await orderBookApi.getOrder(orderId)

		// const trades = await orderBookApi.getTrades({ orderId })

		// const orderCancellationSigningResult = await OrderSigningUtils.signOrderCancellations([orderId], chainId, signer)

		// const cancellationResult = await orderBookApi.sendSignedOrderCancellations({...orderCancellationSigningResult, orderUids: [orderId] })

		// console.log('Results: ', { orderId, order, trades, orderCancellationSigningResult, cancellationResult })
	}

	import ErrorModal from '$lib/components/ErrorModal.svelte';
	// import UserAddress from '$lib/components/UserAddress.svelte';

	// Dispatcher to show/hide the modal
	const dispatch = createEventDispatcher();
	let isModalOpen = false;
	let errorMessage = '';

	// Function to close the modal
	function closeModal() {
		isModalOpen = false;
	}

	async function handleQuoteFormSubmit(quoteRequest) {
		try {
			console.log('Quote Request: ', quoteRequest);
			const { quote } = await orderBookApi.getQuote(quoteRequest);
			console.log('Quote: ', quote);
		} catch (error) {
			errorMessage = error.body.description || 'An error occurred.';
			isModalOpen = true;
		}
	}
</script>

<main>
	<!-- <UserAddress walletAddress={userWalletAddress} /> -->

	<div class="form-container">
		<div class="form-header">Quote request Form</div>
		<QuoteForm onSubmit={handleQuoteFormSubmit} />
	</div>

	{#if isModalOpen}
		<!-- Show the ErrorModal if the modal is open -->
		<ErrorModal {errorMessage} onClose={closeModal} />
	{/if}
</main>

<style>
	/* Center the form on the page */
	main {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 100vh;
	}

	/* Style for the form container */
	.form-container {
		width: 400px;
		padding: 20px; /* Add padding on all sides */
		border: 1px solid #ccc;
		border-radius: 5px;
		background-color: #f9f9f9;
	}

	/* Style for the form header */
	.form-header {
		text-align: center;
		font-size: 1.5rem;
		margin-bottom: 1rem;
	}
</style>
