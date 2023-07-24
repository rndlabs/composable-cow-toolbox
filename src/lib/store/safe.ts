import type { SafeInfo } from '@rndlabs/safe-apps-sdk';
import type SafeAppsSDK from '@rndlabs/safe-apps-sdk';
import { Safe, EthersAdapter } from '@rndlabs/safe-protocol-kit';
import { derived, get, writable, type Readable } from 'svelte/store';
import { rpc } from './chain';
import { ethers } from 'ethers';
import { setError } from './error';

// safe
const safeApp = writable<SafeAppsSDK | undefined>(undefined);
const safeInfo = writable<SafeInfo | undefined>(undefined);

const safe: Readable<Safe | undefined> = derived([safeInfo, rpc], ([$info, $rpc], set) => {
	if ($info && $rpc) {
		Safe.create({
			safeAddress: $info.safeAddress,
			ethAdapter: new EthersAdapter({ ethers, signerOrProvider: $rpc })
		})
			.then((safe) => {
				set(safe);
			})
			.catch((e) => {
				setError(e);
			});
	} else {
		set(undefined);
	}
});

const fallbackHandler: Readable<string | undefined> = derived([safe], ([$safe], set) => {
	if ($safe) {
		$safe
			.getFallbackHandler()
			.then((handler) => {
				set(handler);
			})
			.catch((e) => {
				throw new Error(e);
			});
	} else {
		set(undefined);
	}
});



export { safe, safeApp, safeInfo, fallbackHandler };
