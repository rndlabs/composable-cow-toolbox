<script lang="ts">
	import { onMount } from 'svelte';
	import { init } from '$lib/store/chain';
	import { safeApp as safeAppStore, safeInfo as safeInfoStore } from '$lib/store/safe';
	import type { Opts, SafeInfo } from '@rndlabs/safe-apps-sdk';
	import SafeAppsSDK from '@rndlabs/safe-apps-sdk/dist/src/sdk';

	let pending = false;
	let triedToConnectToSafe = false;

	// Attempt to connect to the safe
	const connect = async () => {
		pending = true;

		let safeInfo: SafeInfo | undefined = undefined;

		const opts: Opts = {
			allowedDomains: [/gnosis-safe.io$/, /app.safe.global$/],
			debug: false
		};

		const safeApp = new SafeAppsSDK(opts);

		// code adapted from `safe-apps-web3modal`
		if (!$safeAppStore && !triedToConnectToSafe) {
			safeInfo = await safeApp.safe.getInfo();
			// TODO: At the moment, for some reason, `safe.getInfo()` hangs forever but
			//       we can await it?!?!
			// safeInfo = await Promise.race([
			// 	safeApp.safe.getInfo(),
			// 	new Promise<undefined>((resolve) => {
			// 		setTimeout(() => {
			// 			console.log('safe.getInfo() timed out');
			// 			resolve(undefined);
			// 		}, 20000);
			// 	})
			// ]);
			triedToConnectToSafe = true;
		}

		// if safeInfo is defined, we connected to the safe
		if (safeInfo) {
			// set the settings on the safe for off-chain signing
			await safeApp.eth.setSafeSettings([
				{
					offChainSigning: true
				}
			]);

			// set the safe stores
			safeAppStore.set(safeApp);
			safeInfoStore.set(safeInfo);

			// now that we have the safe info, we can initialize the chain
			init(safeInfo.chainId, safeInfo.safeAddress);
		}
		pending = false;
	};

	onMount(async () => {
		await connect();
	});
</script>

<slot />
