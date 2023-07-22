import { SupportedChainId } from "@cowprotocol/cow-sdk";

// Define a type mapping a SupportedChainId to an RPC URL
export const RPC_URLS: { [chainId in SupportedChainId]?: string } = {
    [SupportedChainId.MAINNET]: 'https://eth-mainnet.gateway.pokt.network/v1/lb/62bac829123e6f0039896650',
    [SupportedChainId.GOERLI]: 'https://eth-goerli.gateway.pokt.network/v1/lb/62bac829123e6f0039896650',
    [SupportedChainId.GNOSIS_CHAIN]: 'https://gnosischain-archival.gateway.pokt.network/v1/lb/62bac829123e6f0039896650',
}

export type ExplorerUrls = {
    address: (address: string) => string
    transaction: (hash: string) => string
}

export const EXPLORER_URLS: { [chainId in SupportedChainId]?: ExplorerUrls } = {
    [SupportedChainId.MAINNET]: {
        address: (address) => `https://etherscan.io/address/${address}`,
        transaction: (hash) => `https://etherscan.io/tx/${hash}`,
    },
    [SupportedChainId.GOERLI]: {
        address: (address) => `https://goerli.etherscan.io/address/${address}`,
        transaction: (hash) => `https://goerli.etherscan.io/tx/${hash}`,
    },
    [SupportedChainId.GNOSIS_CHAIN]: {
        address: (address) => `https://gnosisscan.io/address/${address}`,
        transaction: (hash) => `https://gnosisscan.io/tx/${hash}`,
    },
}

export const BLOCK_TIME: { [chainId in SupportedChainId]?: number } = {
    [SupportedChainId.MAINNET]: 12,
    [SupportedChainId.GOERLI]: 12,
    [SupportedChainId.GNOSIS_CHAIN]: 5,
}