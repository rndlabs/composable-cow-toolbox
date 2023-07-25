<script lang="ts">
	import type { TransactionBatch } from '$lib/store/safe';
	import Address from './Address.svelte';

	export let batch: TransactionBatch;

	// TransactionBatches are strictly indexed by their order in the array.
	// Therefore the index of the transaction in the array is the same as the index of the transaction in the batch.
	function deleteTransaction(index: number) {
		return () => {
			const tx = batch.txs[index];

			// If tx.wipeRemaining is true, delete all transactions including this one to the end of the batch.
			// Otherwise just delete this one.
			tx.wipeRemaining ? batch.txs.splice(index) : batch.txs.splice(index, 1);
		};
	}
</script>

<div class="content">
	<h4>Transaction batch</h4>
	<div class="table-container">
		<table class="transaction-table">
			<thead>
				<tr class="header">
					<th>To</th>
					<th>Value</th>
					<th>Data</th>
					<th>Description</th>
					<th>Delete</th>
				</tr>
			</thead>
			<tbody class="rows-container">
				{#each batch.txs as tx, i}
					<tr class="transaction-item">
						<!-- "To" column -->
						<td class="transaction-item address"><Address address={tx.tx.to} /></td>
						<!-- "Value" column -->
						<td>{tx.tx.value}</td>
						<!-- "Data" column -->
						<td class="transaction-item address">{tx.tx.data}</td>
						<!-- "Delete" column -->
						<td class="transaction-item address">{tx.description}</td>
						<td>
							<button class="delete-button" on:click={deleteTransaction(i)}>Delete</button>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
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
		border-radius: 0 0 8px 8px; /* Rounded corners for the bottom of the content */
	}

	/* Style for the table */
	.transaction-table {
		width: 100%;
		border-collapse: collapse;
	}

	/* Style for the table header row */
	.header {
		font-weight: bold;
		border-bottom: 1px solid #ddd; /* Add a border at the bottom of the header */
	}

	/* Style for each cell in the table */
	th,
	td {
		padding: 15px 10px; /* Add vertical and horizontal padding to each cell */
		text-align: left; /* Align cell content to the left */
		border-bottom: 1px solid #ddd; /* Add a border at the bottom of each row */
		line-height: 1.5; /* Adjust line-height for proper vertical alignment */
	}

	/* Style for the delete button */
	.delete-button {
		border: none;
		background-color: #dc3545; /* Set background color to red */
		color: #fff;
		padding: 8px 12px;
		border-radius: 4px;
		cursor: pointer;
	}

	/* Hover effect for the delete button */
	.delete-button:hover {
		background-color: #c82333; /* Darker red on hover */
	}

	/* Styles for the transaction item */
	.transaction-item {
		display: table-row;
		justify-content: space-between;
		align-items: center;
	}

	/* Styles for each column in the transaction item */
	.transaction-item > * {
		display: table-cell;
		padding: 0 10px;
	}

	/* Style for the address */
	.transaction-item .address {
		max-width: 200px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	/* Style for the rows container (tbody) */
	.rows-container {
		height: calc(
			20vh - 60px
		); /* Set a fixed height for the rows wrapper (80vh - height of the header) */
		overflow-y: auto; /* Enable vertical scrolling */
	}

	/* Style for the header */
	.header {
		display: table-row;
		justify-content: space-between;
		align-items: center;
	}

	/* Style for the scrollable container */
	.table-container {
		overflow-y: auto; /* Enable vertical scrolling */
		height: 20vh; /* Set a fixed height for the container */
	}
</style>
