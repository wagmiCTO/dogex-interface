import { type Address, defineChain } from 'viem'

export const USDC = {
  address: '0x7e8aD9892265a5A665062b5C3D387aF301A673b6',
  decimal: 6,
}

export const ALLOWED_SLIPPAGE = 0.1

export const TOKENS = [
  {
    name: 'USD Coin',
    symbol: 'USDC',
    decimals: 6,
    address: '0x7e8aD9892265a5A665062b5C3D387aF301A673b6' as Address,
    isStable: true,
    isV1Available: true,
    imageUrl:
      'https://assets.coingecko.com/coins/images/6319/thumb/USD_Coin_icon.png?1547042389',
    coingeckoUrl: 'https://www.coingecko.com/en/coins/usd-coin',
    explorerUrl:
      'https://hyperion-testnet-explorer.metisdevops.link/address/0x7e8aD9892265a5A665062b5C3D387aF301A673b6?tab=read_write_contract',
    isPermitSupported: true,
  },
]

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
