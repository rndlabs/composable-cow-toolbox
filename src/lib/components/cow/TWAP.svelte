<script lang="ts">
	import type { ConditionalOrderParams, TWAP_ADDRESS, TWAPDataParams } from '@cowprotocol/cow-sdk';

	import TokenField from '../TokenField.svelte';
	import type { TokenInfo } from '@uniswap/token-lists';
	import { tokensOnThisChain as tokens } from '$lib/store/tokens';

	export let params: ConditionalOrderParams | undefined;

	type Mutable<T> = {
		-readonly [P in keyof T]?: T[P];
	};

	let twapData: Mutable<TWAPDataParams> = {};
	let sellToken: TokenInfo;
	let buyToken: TokenInfo;

	$: {
		twapData.sellToken = sellToken ? sellToken.address : undefined;
		twapData.buyToken = buyToken ? buyToken.address : undefined;
	}
</script>

<div>
	<!-- Input fields for each property -->
	<TokenField bind:selectedToken={sellToken} tokens={$tokens} label="Sell Token:" />
	<TokenField bind:selectedToken={buyToken} tokens={$tokens} label="Buy Token:" />
	<label>
		Total sell amount:
		<input type="number" bind:value={twapData.sellAmount} />
	</label>
	<label>
		Minimum buy amount:
		<input type="number" bind:value={twapData.buyAmount} />
	</label>
	<label>
		Start Time (unix seconds, or 0 for TX mining time):
		<input type="number" bind:value={twapData.t0} />
	</label>
	<label>
		Number of Parts (n):
		<input type="number" bind:value={twapData.n} />
	</label>
	<label>
		Duration of each part (t):
		<input type="number" bind:value={twapData.t} />
	</label>
	<label>
		Span:
		<input type="number" bind:value={twapData.span} />
	</label>
</div>

<style>
	div {
		display: flex;
		flex-direction: column;
	}

	label {
		margin-bottom: 10px;
	}

	input {
		/* Add any additional styling you want for the input fields here */
	}
</style>
