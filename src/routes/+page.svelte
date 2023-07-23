<script lang="ts">
	import WizardPage from '$lib/components/WizardPage.svelte';
</script>

<WizardPage title="🐮🎶 Composable CoW Toolbox 🧰" rightButton={{ text: 'Next', uri: '/info' }}>
	<p>Welcome to the toolbox!</p>
	<p />
	<p>The toolbox covers the following use cases:</p>
	<ol>
		<li>
			Upgrading an existing <tt>Safe</tt> to <tt>ExtensibleFallbackHandler + ComposableCoW</tt>
		</li>
		<li>
			Placing off-chain ERC-1271 order intents using normal signing (with <tt>Safe</tt> off-chain signature
			aggregation)
		</li>
		<li>Create a single conditional order (<tt>TWAP</tt> anyone?)</li>
		<li>Create multiple conditional orders using Merkle Roots 🌳</li>
	</ol>
	<p>Let's get started! 🚀</p>
</WizardPage>
