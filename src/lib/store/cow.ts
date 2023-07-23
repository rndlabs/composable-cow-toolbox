import { derived, writable } from 'svelte/store';
import { chainId, rpc } from './chain';
import { signerAddress } from './safe';
import { OrderSigningUtils, getDomainVerifier } from '@cowprotocol/cow-sdk';

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

const domainVerifier = derived(
	[domainSeparator, rpc, signerAddress, chainId],
	async ([$domainSeparator, $rpc, $signerAddress, $chainId]) => {
		if (!$domainSeparator || !$rpc || !$signerAddress || !$chainId) {
			return undefined;
		}

		// Retrieve the domain verifier for the GPv2Settlement domain.
		return getDomainVerifier($signerAddress, $domainSeparator, $chainId, $rpc);
	}
)

export { domainSeparator, domainVerifier };
