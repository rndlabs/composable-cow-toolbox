<!-- TokenField.svelte -->
<script lang="ts">
	import type { TokenInfo } from "@uniswap/token-lists";

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
