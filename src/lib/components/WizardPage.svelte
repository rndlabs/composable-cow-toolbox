<!-- WizardPage.svelte -->

<script lang="ts">
	import { goto } from '$app/navigation';

	export let title: string;
	export let leftButton: WizardButtonProps | undefined = undefined;
	export let rightButton: WizardButtonProps | undefined = undefined;
	export let txButton: TXButtonProps | undefined = undefined;

	interface TXButtonProps {
		text: String;
		disabled: boolean;
		handler: () => void;
	}

	interface WizardButtonProps {
		text: string;
		uri: string;
	}

	async function handleButtonClick(props: WizardButtonProps): Promise<void> {
		goto(props.uri);
	}
</script>

<main>
	<div class="page-header">
		<h2>{title}</h2>
	</div>
	<div class="page-content">
		<slot name="content" />
		<slot name="footer" />

		<!-- Render the optional transaction button if provided -->
		{#if txButton}
			<div class="btn-transaction-container">
				<button
					class="btn-transaction {txButton.disabled ? 'disabled' : ''}"
					on:click={txButton.handler}
				>
					{txButton.text}
				</button>
			</div>
		{/if}

		{#if leftButton || rightButton}
			<div class="page-buttons">
				<div class="btn-left-container">
					{#if leftButton}
						<button
							class="btn-left"
							on:click={(e) => {
								if (leftButton) handleButtonClick(leftButton);
							}}>{leftButton.text}</button
						>
					{/if}
				</div>
				<div class="btn-right-container">
					{#if rightButton}
						<button
							class="btn-right"
							on:click={() => {
								if (rightButton) handleButtonClick(rightButton);
							}}>{rightButton.text}</button
						>
					{/if}
				</div>
			</div>
		{/if}
	</div>
</main>

<style>
	/* Reset default styles and apply box-sizing */
	* {
		margin: 0;
		padding: 0;
		box-sizing: border-box;
	}

	/* Style for the main container */
	main {
		width: 100%; /* Make the container fill the available width */
		min-width: 70%; /* Minimum width of 70% for desktop */
		max-width: 400px; /* Maximum width of 400px for mobile */
		height: 80vh; /* Use 80% of the viewport height for the container */
		overflow-y: auto; /* Enable vertical scrolling for the container */
		padding: 20px; /* Add some padding to the content inside the container */
		margin: auto; /* Center the container horizontally */

		/* Media query for mobile view */
		@media (max-width: 767px) {
			width: 100%; /* Full width for mobile */
		}
	}

	/* Style for the page header */
	.page-header {
		background-color: #007bff; /* Blue header background color */
		padding: 12px; /* Add padding to the header */
		text-align: center; /* Center align the title */
		color: #fff; /* White text color */
		font-size: 1.2rem; /* Larger font size for the title */
		font-weight: bold; /* Bold title */
		border-top-left-radius: 8px; /* Rounded top left corner */
		border-top-right-radius: 8px; /* Rounded top right corner */
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Add a slight shadow */
	}

	/* Style for the page content */
	.page-content {
		padding: 20px; /* Add 20px padding to the content */
		border: 1px solid #ddd; /* Border for the content */
		border-radius: 0 0 8px 8px; /* Rounded corners for the bottom of the content */
	}

	/* Style for the page buttons container */
	.page-buttons {
		display: flex;
		justify-content: space-between;
		margin-top: 15px; /* Add some spacing above the buttons */
		padding-top: 15px; /* Add spacing between content and buttons */
		border-top: 1px solid #ddd; /* Top border for the buttons */
	}

	/* Style for the left button container */
	.btn-left-container {
		margin-right: auto;
	}

	/* Style for the left button */
	.btn-left {
		background-color: #007bff;
		color: #fff;
		padding: 8px 12px;
		border: none;
		border-radius: 4px;
		cursor: pointer;
	}

	/* Style for the right button container */
	.btn-right-container {
		margin-left: auto;
	}

	/* Style for the right button */
	.btn-right {
		background-color: #007bff;
		color: #fff;
		padding: 8px 12px;
		border: none;
		border-radius: 4px;
		cursor: pointer;
	}
	.btn-transaction-container {
		display: flex;
		justify-content: center;
		margin-top: 20px; /* Add some spacing above the transaction button */

		/* Align the transaction button to the right */
		justify-content: flex-end;
	}

	/* Style for the transaction button */
	.btn-transaction {
		background-color: #4caf50; /* Green background color for the transaction button */
		color: #fff; /* White text color */
		padding: 10px 20px; /* Larger padding for the transaction button */
		border: none;
		border-radius: 4px;
		cursor: pointer;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Add a slight shadow */
		transition: background-color 0.3s; /* Smooth transition for the background color */

		/* On hover, darken the background color */
		&:hover {
			background-color: #45a049; /* Slightly darker green on hover */
		}
	}
	/* Style for the disabled transaction button */
	.btn-transaction.disabled {
		background-color: #ccc; /* Gray background color for disabled button */
		color: #888; /* Gray text color for disabled button */
		cursor: not-allowed; /* Show not-allowed cursor for disabled button */
	}
</style>
