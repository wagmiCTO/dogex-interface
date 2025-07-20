import type { Address } from 'viem'

export type FootLink = {
  text: string
  subText: string
  link: string
}

export type SocialMedia = 'twitter' | 'discord'
export type Numeric = number | bigint
export type BigNumberish = string | Numeric

export type GetLeverageParams = {
  size: bigint
  collateral: bigint
  fundingFee?: bigint
  hasProfit?: boolean
  delta?: bigint
  includeDelta?: boolean
}

export type ContractPosition = {
  collateral: bigint
  entryPrice: bigint
  isActive: boolean
  isLong: boolean
  pnl: bigint
  size: bigint
}

export type Position = {
  key: Address
  contractKey: any
  collateralToken: Address
  indexToken: Address
  isLong: boolean
  size: bigint
  collateral: bigint
  averagePrice: bigint
  entryFundingRate: bigint
  cumulativeFundingRate: bigint
  hasRealisedProfit: boolean
  realisedPnl: bigint
  lastIncreasedTime: number
  hasProfit: boolean
  delta: bigint
  markPrice: any
  fundingFee: bigint
  collateralAfterFee: bigint
  closingFee: bigint
  positionFee: bigint
  totalFees: bigint
  pendingDelta: bigint
  hasPendingChanges: boolean
  pendingChanges: any
  hasLowCollateral: boolean
  deltaPercentage: bigint
  deltaPercentageStr: string
  deltaStr: string
  deltaBeforeFeesStr: string
  deltaAfterFeesStr: string
  deltaAfterFeesPercentageStr: string
  hasProfitAfterFees: boolean
  pendingDeltaAfterFees: bigint
  deltaPercentageAfterFees: bigint
  leverage: bigint | undefined
  leverageWithPnl: bigint | undefined
  leverageStr: string
  netValue: bigint
}
