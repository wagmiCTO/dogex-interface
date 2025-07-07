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
