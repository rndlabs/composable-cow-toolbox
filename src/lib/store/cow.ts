import { derived, writable, type Readable } from 'svelte/store';
import { chainId, rpc, signerAddress } from './chain';
import { OrderSigningUtils, getDomainVerifier, isComposableCow as isComposableCowSdk } from '@cowprotocol/cow-sdk';

const domainSeparator = writable<string | undefined>(undefined);

// If the chainId changes, then we need to update the domain separator.
chainId.subscribe(async (chainId) => {
	if (chainId) {
		// Retrieve the GPv2Settlement domain separator from the ComposableCoW contract.
		domainSeparator.set(await OrderSigningUtils.getDomainSeparator(chainId));
		return;
	}

	domainSeparator.set(undefined);
});

const domainVerifier: Readable<string | undefined> = derived(
	[domainSeparator, rpc, signerAddress, chainId],
	([$domainSeparator, $rpc, $signerAddress, $chainId], set) => {
		if ($domainSeparator && $rpc && $signerAddress && $chainId) {
			getDomainVerifier($signerAddress, $domainSeparator, $chainId, $rpc)
				.then((domainVerifier) => {
					set(domainVerifier);
				})
				.catch((e) => {
					set(undefined);
				});
		}
		
		set(undefined);
	}
);

const isComposableCow: Readable<boolean> = derived(
	[domainVerifier, chainId],
	([$domainVerifier, $chainId], set) => {
		if ($domainVerifier && $chainId) {
			set(isComposableCowSdk($domainVerifier, $chainId));
			return;
		}

		set(false);
	}
)

export { domainSeparator, domainVerifier, isComposableCow };
