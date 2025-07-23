import { type Address, defineChain, parseEther } from 'viem'
import { arbitrum } from 'viem/chains'

export const USDC = {
  address: '0x8af03F9874b18d1Bd6283B107Daa7B2fCa29EAD1',
  decimal: 6,
}

export const ALLOWED_SLIPPAGE = 0.1

export const TOKENS = [
  {
    name: 'USD Coin',
    symbol: 'USDC',
    decimals: 6,
    address: '0x8af03F9874b18d1Bd6283B107Daa7B2fCa29EAD1' as Address,
    isStable: true,
    isV1Available: true,
    imageUrl:
      'https://assets.coingecko.com/coins/images/6319/thumb/USD_Coin_icon.png?1547042389',
    coingeckoUrl: 'https://www.coingecko.com/en/coins/usd-coin',
    explorerUrl:
      'https://arbiscan.io/address/0xaf88d065e77c8cC2239327C5EDb3A432268e5831',
    isPermitSupported: true,
  },
]

const constants = {
  [arbitrum.id]: {
    nativeTokenSymbol: 'ETH',
    wrappedTokenSymbol: 'WETH',
    defaultCollateralSymbol: 'USDC.e',
    defaultFlagOrdersEnabled: false,
    positionReaderPropsLength: 9,
    v2: true,

    SWAP_ORDER_EXECUTION_GAS_FEE: parseEther('0.0003'),
    INCREASE_ORDER_EXECUTION_GAS_FEE: parseEther('0.0003'),
    DECREASE_ORDER_EXECUTION_GAS_FEE: parseEther('0.000300001'),
  },
} as const

export const getConstant = (chainId: number, key: string) => {
  if (!constants[chainId as keyof typeof constants]) {
    throw new Error(`Unsupported chainId ${chainId}`)
  }

  if (!(key in constants[chainId as keyof typeof constants])) {
    throw new Error(`Key ${key} does not exist for chainId ${chainId}`)
  }

  // @ts-ignore
  return constants[chainId][key]
}

export const UPDATED_POSITION_VALID_DURATION = 60 * 1000
export const FUNDING_RATE_PRECISION = 1000000
export const MARGIN_FEE_BASIS_POINTS = 10
export const BASIS_POINTS_DIVISOR_BIGINT = 10000n
export const USD_DECIMALS = 30
export const PENDING_POSITION_VALID_DURATION = 600 * 1000

export const hyperion = defineChain({
  id: 133717,
  name: 'Hyperion tetsnet',
  nativeCurrency: { name: 'tMETIS', symbol: 'tMETIS', decimals: 18 },
  rpcUrls: {
    default: {
      http: ['https://hyperion-testnet.metisdevops.link'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Hyperionscan',
      url: 'https://hyperion-testnet-explorer.metisdevops.link',
    },
  },
  testnet: true,
})
