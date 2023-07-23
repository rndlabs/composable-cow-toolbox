import type { SafeInfo } from '@rndlabs/safe-apps-sdk';
import type SafeAppsSDK from '@rndlabs/safe-apps-sdk';
import { Safe, EthersAdapter } from '@rndlabs/safe-protocol-kit';
import { derived, get, writable, type Readable } from 'svelte/store';
import { rpc } from './chain';
import { ethers } from 'ethers';
import { setError } from './error';

// safe
const safeApp = writable<SafeAppsSDK | undefined>(undefined);

// If the safe becomes defined, then we get the info.
const safeInfo: Readable<SafeInfo | undefined> = derived([safeApp], ([$safe], set) => {
	if ($safe) {
		$safe.safe
			.getInfo()
			.then((info) => {
				set(info);
			})
			.catch((e) => {
				throw new Error(e);
			});
	} else if (get(safeInfo)) {
		set(undefined);
	}
});

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

const connected: Readable<boolean> = derived([safeApp], ([$safe], set) => {
	if ($safe) {
		set(true);
	} else {
		set(false);
	}
});

const signerAddress: Readable<string | undefined> = derived([safeInfo], ([$safeInfo], set) => {
	if ($safeInfo) {
		set($safeInfo.safeAddress);
	} else {
		set(undefined);
	}
});

export { safe, safeApp, safeInfo, fallbackHandler, connected, signerAddress };
