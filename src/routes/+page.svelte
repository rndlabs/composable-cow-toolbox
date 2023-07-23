<script lang="ts">
	import { goto } from '$app/navigation';
	import WizardPage from '$lib/components/WizardPage.svelte';
</script>

<WizardPage title="🐮🎶 Composable CoW Toolbox 🧰" on:button-click-right={()=>goto('/info')} showButtonRight={true} buttonTextRight="Next">
	<p>Welcome to the toolbox!<p>
	<p>The toolbox covers the following use cases:</p>
	<ol>
		<li>Upgrading an existing <tt>Safe</tt> to <tt>ExtensibleFallbackHandler + ComposableCoW</tt></li>
		<li>Placing off-chain ERC-1271 order intents using normal signing (with <tt>Safe</tt> off-chain signature aggregation)</li>
		<li>Create a single conditional order (<tt>TWAP</tt> anyone?)</li>
		<li>Create multiple conditional orders using Merkle Roots 🌳</li>
	</ol>
	<p>Let's get started! 🚀</p>
</WizardPage>
