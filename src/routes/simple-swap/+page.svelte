<script lang="ts">
	import {
		OrderBookApi,
		OrderSigningUtils,
		type OrderQuoteRequest,
		type OrderQuoteResponse,
		SigningScheme,
		type OrderParameters
	} from '@cowprotocol/cow-sdk';

	import { BigNumber } from 'ethers';
	import { setError } from '$lib/store/error';
	import { sigMonitor } from '$lib/store/safe';
	import { signerAddress, chainId } from '$lib/store/chain';
	import { explorerUrlOrder } from '$lib/utils';
	import WizardPage from '$lib/components/WizardPage.svelte';
	import QuoteView from '$lib/components/QuoteView.svelte';
	import QuoteForm from '$lib/components/QuoteForm.svelte';
	
	let orderBookApi: OrderBookApi;
	$: {
		orderBookApi = new OrderBookApi({ chainId: $chainId! });
	}

	// Dispatcher to show/hide the modal
	let quote: OrderQuoteResponse;
	let orderUid: string;

	async function handleQuoteFormSubmit(quoteRequest: OrderQuoteRequest) {
		try {
			console.log('Quote Request: ', quoteRequest);
			quote = await orderBookApi.getQuote({
				...quoteRequest,
			});
			quote = {
				...quote,
				quote: {
					...quote.quote,
					sellAmount: BigNumber.from(quote.quote.sellAmount)
						.add(BigNumber.from(quote.quote.feeAmount))
						.mul(1005)
						.div(1000)
						.toString(),
					feeAmount: '0',
				}
			}
			console.log('Quote: ', quote);
		} catch (error: any) {
			setError(error.body.description || 'An error occurred.');
		}
	}

	// Create a fake swap handler to show the modal
	async function handleSubmitSwap() {
		// At this point, we are to submit this for signing

		const gpv2SettlementDomain = await OrderSigningUtils.getDomain($chainId!);

		$sigMonitor?.add(
			{
				description: 'Swap',
				msg: {
					domain: {
						...gpv2SettlementDomain,
						chainId: String(gpv2SettlementDomain.chainId),
						salt: undefined,
					},
					types: OrderSigningUtils.getEIP712Types(),
					message: quote.quote,
				},

			},
			// callback for submitting the order to the orderbook
			async (hash: string) => {
				// get the message from the sig monitor
				const {msg, offChainSignature} = $sigMonitor!.record['confirmed'][$chainId!][hash];

				const orderBookApi = new OrderBookApi({chainId: $chainId!})
				orderUid = await orderBookApi.sendOrder({
					...msg.message as OrderParameters,
					from: $signerAddress!,
					signingScheme: SigningScheme.EIP1271,
					signature: offChainSignature!
				});
			},
		);
	}
</script>

<WizardPage
	title="🐮🎶 Composable CoW Toolbox 🧰"
	leftButton={{ text: 'Back', uri: '/setup' }}
	rightButton={{ text: 'Next', uri: '/simple-swap' }}
>
	<QuoteForm slot="content" onSubmit={handleQuoteFormSubmit} />
	<div slot="footer">
		{#if quote}
			<QuoteView {quote} />
			<div class="btn-container">
				<button
				class="btn-sign"
				on:click={handleSubmitSwap}>Swap!</button
			>
			</div>
		{/if}
		{#if orderUid}
			<div>Order successfully submitted: <a href="{explorerUrlOrder(orderUid, $chainId)}">{orderUid.slice(2,10)}</a></div>
		{/if}
	</div>
</WizardPage>

<style>
	/* Add padding to the Swap button */
	.btn-container {
		padding-top: 10px; /* Adjust the value as needed */
		padding-bottom: 10px; /* Adjust the value as needed */
	}
</style>