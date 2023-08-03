<script lang="ts">
	import WizardPage from '$lib/components/WizardPage.svelte';
	import type { ConditionalOrderParams } from '@cowprotocol/cow-sdk';
	import TWAP from '$lib/components/cow/TWAP.svelte';
	// Import other conditional order components if applicable

	function handleConditionalOrderSubmit() {}

	let params: ConditionalOrderParams | undefined = undefined;

	// Object containing keys as order type strings and values as corresponding Svelte components
	const conditionalOrderComponents: Record<string, any> = {
		TWAP
		// Add other conditional order components here
	};

	// Array of conditional order type strings
	const conditionalOrderTypes = Object.keys(conditionalOrderComponents);

	// Default selected type
	let selectedConditionalOrderType = conditionalOrderTypes[0];
</script>

<WizardPage
	title="🐮🎶 Composable CoW Toolbox 🧰"
	leftButton={{ text: 'Back', uri: '/simple-swap' }}
	rightButton={{ text: 'Multi Conditional Order', uri: '/multi-conditional-order' }}
>
	<div slot="content">
		<!-- Drop-down selector for conditional order type -->
		<label>
			Conditional Order Type:
			<select bind:value={selectedConditionalOrderType}>
				{#each conditionalOrderTypes as type}
					<option value={type}>{type}</option>
				{/each}
			</select>
		</label>

		{#if selectedConditionalOrderType in conditionalOrderComponents}
			<!-- Wrapper div with border for the selected order type component -->
			<div class="order-type-wrapper">
				<!-- Render the selected Svelte component dynamically -->
				<svelte:component
					this={conditionalOrderComponents[selectedConditionalOrderType]}
					bind:params
					on:submit={handleConditionalOrderSubmit}
				/>
			</div>
		{/if}
	</div>
</WizardPage>

<style>
	/* Styling for the drop-down selector */
	select {
		padding: 8px;
		font-size: 16px;
		border: 1px solid #ccc;
		border-radius: 4px;
		width: 100%;
		margin-bottom: 10px;
	}

	/* Styling for the bordered wrapper div */
	.order-type-wrapper {
		border: 1px solid #ccc;
		padding: 20px;
		border-radius: 4px;
	}
</style>
