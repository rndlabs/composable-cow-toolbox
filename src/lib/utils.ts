// returns a shortened address string with ellipses in the middle
export const formatAddress = (address: string, chars = 4) => {
	const start = address.slice(0, chars + 2);
	const end = address.slice(-chars);
	return `${start}...${end}`;
};
