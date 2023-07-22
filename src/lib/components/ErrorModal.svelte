<!-- ErrorModal.svelte -->
<script lang="ts">
	import { error, clearError } from "$lib/store/error";

	function handleClose() {
		clearError();
	}
</script>

<div class="modal-overlay">
	<div class="modal-content">
		<span class="close" on:click={handleClose}>&times;</span>
		<p>{$error}</p>
	</div>
</div>

<style>
	/* Modal styles */
	.modal-overlay {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, 0.6); /* Semi-transparent background */
		display: flex;
		justify-content: center;
		align-items: center;
		z-index: 9999; /* Make sure the modal is on top of other content */
	}

	.modal-content {
		background-color: #fff;
		padding: 20px;
		border-radius: 5px;
		box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
		max-width: 400px;
		width: 90%;
		text-align: center;
	}

	.close {
		cursor: pointer;
		position: absolute;
		top: 10px;
		right: 10px;
		font-size: 1.8rem; /* Increase the font size */
		color: #e74c3c; /* Change the color to a prominent red (#e74c3c) */
		background-color: #fff;
		border-radius: 50%; /* Make the button circular */
		width: 30px;
		height: 30px;
		display: flex;
		justify-content: center;
		align-items: center;
		box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.3); /* Add a subtle shadow */
	}

	p {
		margin: 0;
		font-size: 1.1rem;
	}
</style>
