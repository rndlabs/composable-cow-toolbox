import type SafeSettings from '@safe-global/safe-apps-sdk';
import type { SafeInfo } from '@safe-global/safe-apps-sdk';
import type SafeAppsSDK from '@safe-global/safe-apps-sdk';
import { derived, get, writable, type Readable } from 'svelte/store';
import { rpc } from './chain';

// safe
const safe = writable<SafeAppsSDK | undefined>(undefined);
const safeSettings = writable<SafeSettings | undefined>(undefined);

// If the safe becomes defined, then we get the info.
const safeInfo: Readable<SafeInfo | undefined> = derived(
    [safe],
    ([$safe], set) => {
        if ($safe) {
            $safe.safe.getInfo().then((info) => {
                set(info)
            }).catch((e) => {
                throw new Error(e)
            })
        } else if (get(safeInfo)) {
            set(undefined)
        }
    }
)

const connected = derived(
    [safe],
    ([$safe], set) => {
        if ($safe) {
            set(true)
        } else {
            set(false)
        }
    }
)

const signerAddress: Readable<string | undefined> = derived(
    [safeInfo],
    ([$safeInfo], set) => {
        if ($safeInfo) {
            set($safeInfo.safeAddress)
        } else {
            set(undefined)
        }
    }
)

// const ensOrAddress = derived(
//     [safeInfo, rpc],

// // $: ensOrAddress = async () => {
// //     if ($rpc && $safeInfo) {
// //         const ens = await $rpc.lookupAddress($safeInfo.safeAddress);
// //         return ens || formatAddress($safeInfo.safeAddress);
// //     } else {
// //         return 'Not connected';
// //     }
// // };

// // safe settings
// const safeSettings = writable<SafeSettings | undefined>(undefined)

export { safe, safeInfo, safeSettings, connected, signerAddress }
