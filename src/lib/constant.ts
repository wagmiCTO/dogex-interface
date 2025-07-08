import { type Address, parseEther } from 'viem'
import { arbitrum } from 'viem/chains'
import type { FootLink, SocialMedia } from '@/lib/types'

export const FOOTER_LINKS: FootLink[] = [
  { text: 'TERMS OF USE', subText: 'LEGAL TERMS', link: '/terms-of-use' },
  {
    text: 'DOCS',
    subText: 'LEARN MORE',
    link: 'https://docs.oogabooga.io/',
  },
]

export const SOCIAL_MEDIA_LINKS: Record<SocialMedia, string> = {
  twitter: 'https://twitter.com/0xoogabooga',
  discord: 'https://discord.com/invite/0xoogabooga',
}

export const USDC = {
  address: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831',
  decimal: 6,
}

export const LINK = {
  address: '0xf97f4df75117a78c1A5a0DBb814Af92458539FB4',
  decimal: 18,
}

export const ALLOWED_SLIPPAGE = 0.1

export const TOKENS = [
  {
    name: 'Chainlink',
    symbol: 'LINK',
    decimals: 18,
    priceDecimals: 4,
    address: '0xf97f4df75117a78c1A5a0DBb814Af92458539FB4' as Address,
    isStable: false,
    isShortable: true,
    categories: ['defi'],
    imageUrl:
      'https://assets.coingecko.com/coins/images/877/thumb/chainlink-new-logo.png?1547034700',
    coingeckoUrl: 'https://www.coingecko.com/en/coins/chainlink',
    explorerUrl:
      'https://arbiscan.io/token/0xf97f4df75117a78c1a5a0dbb814af92458539fb4',
    isV1Available: true,
    isPermitSupported: true,
    contractVersion: '1',
  },
  {
    name: 'USD Coin',
    symbol: 'USDC',
    decimals: 6,
    address: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831' as Address,
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
export const BASIS_POINTS_DIVISOR = 10000
