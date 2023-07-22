<script lang="ts">
	import {
		OrderBookApi,
		SupportedChainId,

		type OrderQuoteRequest,

		type OrderQuoteResponse


	} from '@cowprotocol/cow-sdk';

	import QuoteForm from '$lib/components/QuoteForm.svelte';
	import CollapsableComponent from '$lib/components/CollapsableComponent.svelte';
	import { setError } from '$lib/store/error';
	import { tokensOnThisChain } from '$lib/store/tokens';

	tokensOnThisChain.subscribe((tokens) => {
		console.log('Tokens: ', tokens);
	});

	const orderBookApi = new OrderBookApi({ chainId: SupportedChainId.GOERLI });

	// Dispatcher to show/hide the modal
	let quote: OrderQuoteResponse;

	async function handleQuoteFormSubmit(quoteRequest: OrderQuoteRequest) {
		try {
			console.log('Quote Request: ', quoteRequest);
			quote = await orderBookApi.getQuote(quoteRequest);
			console.log('Quote: ', quote);
		} catch (error: any) {
			setError(error.body.description || 'An error occurred.');
		}
	}
</script>

<CollapsableComponent title="Quote request">
	<QuoteForm onSubmit={handleQuoteFormSubmit} />
</CollapsableComponent>
