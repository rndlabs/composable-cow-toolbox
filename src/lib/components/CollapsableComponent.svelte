<script>
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';

	export let title = '';
	export let toggle = true;
	let isCollapsed = false;

	function toggleCollapse() {
		isCollapsed = !isCollapsed;
	}

	// Fire onMount to initialize the state
	onMount(() => {
		isCollapsed = false;
	});
</script>

<div class:collapsed={isCollapsed} class="collapsible-container">
	<div class="header">
		<!-- Component label -->
		<h2 class="label">{title}</h2>

		<!-- Collapsible chevron button -->
		{#if toggle}
			<button class="collapse-button" on:click={toggleCollapse}>
				{#if isCollapsed}
					&#9658; <!-- Right-pointing chevron when collapsed -->
				{:else}
					&#9660; <!-- Down-pointing chevron when expanded -->
				{/if}
			</button>
		{/if}
	</div>

	<!-- Slot for other components within this component -->
	<div class="slot-content" transition:fade>
		<slot />
	</div>
</div>

<style>
	/* Container styling */
	.collapsible-container {
		border: 1px solid #ccc;
		border-radius: 5px;
		padding: 1rem;
		margin-bottom: 1rem;
		max-height: 1000px; /* Set a large max-height for the transition effect */
		transition: max-height 0.5s ease-in-out; /* Add the transition effect */
		overflow: hidden;
	}

	/* Header styling */
	.header {
		display: flex;
		align-items: center;
	}

	.label {
		flex: 1;
		margin: 0;
	}

	/* Chevron button styling */
	.collapse-button {
		font-size: 20px;
		cursor: pointer;
		background: none;
		border: none;
		color: blue; /* Change the color to blue */
	}

	/* Styling for the collapsed state */
	.collapsible-container.collapsed {
		max-height: 40px; /* Set the desired height for the collapsed state */
	}

	/* Slot content styling */
	.slot-content {
		opacity: 1;
		transition: opacity 0.5s ease-in-out; /* Add the fade transition effect */
	}

	/* Styling for the faded out state */
	.collapsible-container.collapsed .slot-content {
		opacity: 0; /* Set the opacity to 0 when the component is collapsed */
	}
</style>
