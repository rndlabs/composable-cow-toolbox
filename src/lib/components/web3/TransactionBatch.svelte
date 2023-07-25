<script lang="ts">
	import Address from './Address.svelte';

	// create a delete function to respond to a click event
	function deleteRow(to: string) {
		return () => {
			// filter out the row that matches the "to" address
			rows = rows.filter((row) => row[0] !== to);
		};
	}

	let rows = [
		[
			'0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2',
			'0 ETH',
			'0x5B38Da6a701c568545dCfcB03FcB875f56beddC45B38Da6a701c568545dCfcB03FcB875f56beddC4'
		],
		[
			'0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2',
			'0 ETH',
			'0x5B38Da6a701c568545dCfcB03FcB875f56beddC45B38Da6a701c568545dCfcB03FcB875f56beddC4'
		],
		[
			'0xCA35b7d915458EF540aDe6068dFe2F44E8fa733c',
			'0.05 ETH',
			'0x8d3d7c18e93A8e6F83E5F9fBfb0b34A16772B8e2'
		],
		[
			'0x5B38Da6a701c568545dCfcB03FcB875f56beddC4',
			'0.1 ETH',
			'0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2'
		]
	];
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
					<th>Delete</th>
				</tr>
			</thead>
			<tbody class="rows-container">
				{#each rows as row}
					<tr class="transaction-item">
						<!-- "To" column -->
						<td class="transaction-item address"><Address address={row[0]} /></td>
						<!-- "Value" column -->
						<td>{row[1]}</td>
						<!-- "Data" column -->
						<td class="transaction-item address">{row[2]}</td>
						<!-- "Delete" column -->
						<td>
							<button class="delete-button" on:click={deleteRow(row[0])}> Delete </button>
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
