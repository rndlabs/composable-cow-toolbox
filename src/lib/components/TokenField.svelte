<!-- TokenField.svelte -->
<script lang="ts">
    interface Token {
      value: string;
      label: string;
    }
  
    export let tokens: Token[];
    export let selectedToken: string = '';
</script>

<label>
	Token:
	<select bind:value={selectedToken} required>
		{#each tokens as token}
			<option value={token.value}>{token.label}</option>
		{/each}
	</select>
</label>
