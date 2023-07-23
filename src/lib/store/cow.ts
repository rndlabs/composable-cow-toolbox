import { writable } from "svelte/store";
import { chainId } from "./chain";
import { OrderSigningUtils } from "@cowprotocol/cow-sdk";

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

export { domainSeparator };