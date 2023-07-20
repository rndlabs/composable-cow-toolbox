<!-- BlockNumber.svelte -->
<script>
	import { blockNumber } from '$lib/store/chain';

	let css = 'dot';

	blockNumber.subscribe((value) => {
		const old = css;
		css = 'dot spin';
		setTimeout(() => {
			css = old;
		}, 1000);
	});
</script>

<div class="block-number-container">
	<div class="dot-container">
		<div class="dot" />
	</div>
	{$blockNumber}
</div>

<style>
	.block-number-container {
		position: fixed;
		bottom: 20px;
		right: 20px;
		display: flex;
		align-items: center;
		font-size: 16px;
		font-weight: bold;
		background-color: #f9f9f9;
		border: 1px solid #ccc;
		border-radius: 20px;
		padding: 8px;
	}

	.dot-container {
		position: relative;
		width: 24px; /* Adjust the size of the dot container */
		height: 24px; /* Adjust the size of the dot container */
		margin-right: 8px;
	}

	.dot {
		position: absolute;
		top: 50%;
		left: 50%;
		width: 10px; /* Adjust the size of the dot */
		height: 10px; /* Adjust the size of the dot */
		border-radius: 50%;
		background-color: #007bff;
		transform: translate(-50%, -50%);
	}
</style>
