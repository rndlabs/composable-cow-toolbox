<script lang="ts">
	import { onMount } from 'svelte';
	import { init } from '$lib/store/chain';
	import { safeApp as safeAppStore, safeInfo, connected } from '$lib/store/safe';
	import type { Opts } from '@rndlabs/safe-apps-sdk';
	import { setError } from '$lib/store/error';
	import SafeAppsSDK from '@rndlabs/safe-apps-sdk/dist/src/sdk';

	let pending = false;

	// Attempt to connect to the safe
	const connect = async () => {
		pending = true;
		try {
			const opts: Opts = {
				allowedDomains: [/gnosis-safe.io$/, /app.safe.global$/],
				debug: false
			};

			const safeApp = new SafeAppsSDK(opts);

			// set the settings on the safe for off-chain signing
			await safeApp.eth.setSafeSettings([
				{
					offChainSigning: true
				}
			]);

			safeAppStore.set(safeApp);
			// safeSettings.set(currentSettings);

			// spawn a listener for the safe info
			// this is used to determine when to init the chain
			const unsubscriber = safeInfo.subscribe((info) => {
				if (info) {
					init(info.chainId);
				}
			});

			// create a timer to watch for the safe to be connected
			// if it doesn't connect within 5 seconds, throw an error
			setTimeout(() => {
				if (!$connected) {
					setError('Error connecting to safe!');
				}
				unsubscriber();
			}, 5000);
		} catch (e: any) {
			setError('Unknown error: ' + e.message);
		}
		pending = false;
	};

	onMount(async () => {
		await connect();
	});
</script>

<slot />
