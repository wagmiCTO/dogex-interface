import type { Address } from "viem";
import { arbitrum, arbitrumSepolia, sepolia } from "viem/chains";

export const CONTRACTS: Record<number, { [key: string]: Address }> = {
	[arbitrum.id]: {
		// arbitrum mainnet
		Vault: "0x489ee077994B6658eAfA855C308275EAd8097C4A", //gmx now
	},
	[sepolia.id]: {
		Dogex: "0x560B2b86066742302417bf28Da2142d1aD81F773",
	},
};

export function getContract(
	chainId: number | undefined,
	name: string,
): Address {
	if (!chainId || !CONTRACTS[chainId]) {
		throw new Error(`Unknown chainId ${chainId}`);
	}

	if (!CONTRACTS[chainId][name]) {
		throw new Error(`Unknown contract "${name}" for chainId ${chainId}`);
	}

	return CONTRACTS[chainId][name];
}
