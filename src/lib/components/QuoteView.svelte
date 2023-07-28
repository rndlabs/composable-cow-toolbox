<script lang="ts">
    import type { OrderQuoteResponse } from '@cowprotocol/cow-sdk';
	import type { TokenInfo } from '@uniswap/token-lists';
	import { utils } from 'ethers';
    import { tokensOnThisChain } from '$lib/store/tokens';

	export let quote: OrderQuoteResponse;

	let sellToken: TokenInfo | string = quote.quote.sellToken;
	let buyToken: TokenInfo | string = quote.quote.buyToken;

	$: {
		sellToken = $tokensOnThisChain.find((token) => token.address === quote.quote.sellToken) || quote.quote.sellToken;
    	buyToken = $tokensOnThisChain.find((token) => token.address === quote.quote.buyToken) || quote.quote.buyToken;
	}

	function withDecimalsFallback(value: string, token: TokenInfo | string): string {
		return typeof token === 'string' ? value : utils.formatUnits(value, token.decimals);
	}

</script>

<div class="content">
	<h4>Quote details</h4>
	<div class="details-table">
		<div class="details-row">
			<div class="details-cell">Sell Token:</div>
			<div class="details-cell">{typeof sellToken == 'string' ? sellToken : `${sellToken.name} ( ${sellToken.symbol})` }</div>
		</div>
		<div class="details-row">
			<div class="details-cell">Buy Token:</div>
			<div class="details-cell">{typeof buyToken == 'string' ? buyToken : `${buyToken.name} ( ${buyToken.symbol})` }</div>
		</div>
		<div class="details-row">
			<div class="details-cell">Fee Amount:</div>
			<div class="details-cell">{withDecimalsFallback(quote.quote.feeAmount, sellToken)}</div>
		</div>
		<div class="details-row">
			<div class="details-cell">Sell Amount:</div>
			<div class="details-cell">{withDecimalsFallback(quote.quote.sellAmount, sellToken)}</div>
		</div>
		<div class="details-row">
			<div class="details-cell">Buy Amount:</div>
			<div class="details-cell">{withDecimalsFallback(quote.quote.buyAmount, buyToken)}</div>
		</div>
	</div>
</div>

<style>
	/* Reset default styles and apply box-sizing */
	* {
		margin: 0;
		padding: 0;
		box-sizing: border-box;
	}

	/* Style for the page content */
	.content {
		padding: 20px; /* Add 20px padding to the content */
		border: 1px solid #ddd; /* Border for the content */
		border-radius: 8px; /* Rounded corners */
	}

	/* Style for the details table */
	.details-table {
		display: table;
		width: 100%;
		border-collapse: collapse;
	}

	/* Style for each row in the details table */
	.details-row {
		display: table-row;
	}

	/* Style for each cell in the details table */
	.details-cell {
		display: table-cell;
		padding: 8px; /* Add padding to each cell */
		border-bottom: 1px solid #ddd; /* Add a border at the bottom of each row */
	}
</style>
