import { BLOCK_TIME, RPC_URLS } from '$lib/constants';
import type { SupportedChainId } from '@cowprotocol/cow-sdk';
import { providers } from 'ethers';
import { writable } from 'svelte/store';

const NUM_BLOCKS = 3;

// provider
const rpc = writable<providers.JsonRpcProvider | undefined>(undefined);
const blockNumber = writable<number | undefined>(undefined);
const chainId = writable<SupportedChainId | undefined>(undefined);
const connected = writable<boolean>(false);
const signerAddress = writable<string | undefined>(undefined);

// holds the handler for the block monitoring
let timerHandle: NodeJS.Timeout | undefined = undefined;

export async function init(_chainId: SupportedChainId, address: string): Promise<void> {
	// set the provider based on the chainId
	const provider = new providers.StaticJsonRpcProvider(RPC_URLS[_chainId]!);

	// wait to be ready
	provider.ready.then(async () => {
		// set the provider
		chainId.set(_chainId);
		rpc.set(provider);
		signerAddress.set(address);
		blockNumber.set(await provider.getBlockNumber());
		connected.set(true);
	});
}

// On any change to the provider, restart the block monitoring
rpc.subscribe(async (provider) => {
	if (provider) {
		const network = await provider.getNetwork();
		const blockTime = BLOCK_TIME[network.chainId as keyof typeof BLOCK_TIME] || 12;

		// clear the old timer
		if (timerHandle) {
			clearInterval(timerHandle);
		}

		// run block monitoring for each block
		timerHandle = setInterval(async () => {
			if (document.visibilityState === 'visible') {
				blockNumber.set(await provider.getBlockNumber());
			}
		}, NUM_BLOCKS * blockTime * 1000);
	}
});

export { rpc, blockNumber, chainId, connected, signerAddress };
