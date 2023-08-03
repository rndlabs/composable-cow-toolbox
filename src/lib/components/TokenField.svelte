<!-- TokenField.svelte -->
<script lang="ts">
	import type { TokenInfo } from '@uniswap/token-lists';

	export let tokens: TokenInfo[];
	export let label: string;
	export let selectedToken: TokenInfo;
</script>

<label>
	{label}
	<select bind:value={selectedToken} required>
		{#each tokens as token}
			<option value={token}>{token.name} ({token.symbol})</option>
		{/each}
	</select>
</label>

<style>
	label {
		display: flex;
		flex-direction: column;
		margin-bottom: 10px;
	}

	select {
		padding: 8px;
		font-size: 16px;
		border: 1px solid #ccc;
		border-radius: 4px;
		width: 100%;
	}
</style>
