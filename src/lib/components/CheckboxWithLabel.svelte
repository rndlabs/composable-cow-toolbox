<script lang="ts">
	export let checked = false;
	export let handler: (checked: boolean) => void;

	function handleCheckboxChange() {
		handler(checked);
	}
</script>

<div>
	<input type="checkbox" bind:checked on:change={handleCheckboxChange} />
	<label>
		{#if checked}
			<slot name="whenChecked" />
		{:else}
			<slot name="whenNotChecked" />
		{/if}
	</label>
</div>

<style>
	/* Style for the checkbox container */
	div {
		display: flex;
		align-items: center;
		margin-bottom: 10px;
	}

	/* Style for the checkbox input */
	input[type='checkbox'] {
		margin-right: 10px;
	}

	/* Style for the label */
	label {
		font-size: 16px;
		color: #333;
	}
</style>
