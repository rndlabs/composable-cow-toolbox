import { SupportedChainId } from '@cowprotocol/cow-sdk';

// returns a shortened address string with ellipses in the middle
export const formatAddress = (address: string, chars = 4) => {
	const start = address.slice(0, chars + 2);
	const end = address.slice(-chars);
	return `${start}...${end}`;
};

export const explorerUrlOrder = (tx: string, chainId?: SupportedChainId) => {
	switch (chainId) {
		case SupportedChainId.MAINNET:
			return `https://explorer.cow.fi/orders/${tx}`;
		case SupportedChainId.GOERLI:
			return `https://explorer.cow.fi/goerli/orders/${tx}`;
		case SupportedChainId.GNOSIS_CHAIN:
			return `https://explorer.cow.fi/gnosis/orders/${tx}`;
		default:
			return `https://explorer.cow.fi/orders/${tx}`;
	}
};
