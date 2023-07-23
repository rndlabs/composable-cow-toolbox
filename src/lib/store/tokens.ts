import { derived, get, writable } from 'svelte/store';
import type { TokenInfo, TokenList } from '@uniswap/token-lists';
import { chainId } from './chain';
import { TOKEN_LISTS } from '$lib/constants';

// Create a writable store for the token list
export const tokenList = writable<TokenList | undefined>(undefined);

export const tokensOnThisChain = derived([tokenList, chainId], ([$tokens, $chainId]) => {
	if ($tokens && $chainId) {
		return $tokens.tokens.filter((token) => token.chainId === $chainId);
	} else {
		return [];
	}
});

export async function init(): Promise<void> {
	// If the token list is already set, then we don't need to do anything
	if (get(tokenList)) {
		return;
	}

	// iterate through each token list and fetch it
	const tokenLists = await Promise.all(
		TOKEN_LISTS.map(async (url) => {
			const response = await fetch(url);
			return (await response.json()) as TokenList;
		})
	);

	// merge the token lists
	tokenList.set(mergeTokenLists(...tokenLists));
}

function mergeTokenLists(...lists: TokenList[]): TokenList {
	const mergedTokensMap = new Map<string, TokenInfo>();

	// Iterate through each token list and add tokens to the mergedTokensMap
	for (const list of lists) {
		for (const token of list.tokens) {
			const tokenKey = `${token.address}-${token.chainId}`;
			mergedTokensMap.set(tokenKey, token);
		}
	}

	// Convert the mergedTokensMap values back to an array to create the merged tokens list
	const mergedTokens = Array.from(mergedTokensMap.values());

	// Create and return the merged TokenList
	return {
		name: 'Merged Token List',
		timestamp: new Date().toISOString(),
		tokens: mergedTokens,
		version: { major: 1, minor: 0, patch: 0 }
	};
}
