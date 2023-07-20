import { BLOCK_TIME, RPC_URLS } from '$lib/constants';
import type { SupportedChainId } from '@cowprotocol/cow-sdk';
import { providers } from 'ethers';
import { writable } from 'svelte/store';

const NUM_BLOCKS = 3;

// provider
const rpc = writable<providers.StaticJsonRpcProvider | undefined>(undefined);
const blockNumber = writable<number | null>(undefined);

let timerHandle: NodeJS.Timeout | undefined = undefined;

export async function init(chainId: SupportedChainId): Promise<void> {
    // set the provider based on the chainId
    const provider = new providers.StaticJsonRpcProvider(RPC_URLS[chainId]!);

    // set the provider
    rpc.set(provider);
    blockNumber.set(await provider.getBlockNumber());
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

export { rpc, blockNumber };
