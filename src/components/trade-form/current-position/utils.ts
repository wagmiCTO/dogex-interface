import {
  type Address,
  encodeAbiParameters,
  keccak256,
  parseAbiParameters,
} from 'viem'
import { bigMath, mulDiv } from '@/lib/bigmath'
import {
  BASIS_POINTS_DIVISOR_BIGINT,
  FUNDING_RATE_PRECISION,
  getConstant,
  MARGIN_FEE_BASIS_POINTS,
  PENDING_POSITION_VALID_DURATION,
  TOKENS,
  UPDATED_POSITION_VALID_DURATION,
  USD_DECIMALS,
} from '@/lib/constant'
import type { GetLeverageParams } from '@/lib/types'
import { formatAmount } from '@/lib/utils'

export function getPositionQuery() {
  const tokens = TOKENS

  const collateralTokens: any[] = []
  const indexTokens: any[] = []
  const isLong: any[] = []

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i]
    if (token.isStable) {
      continue
    }
    collateralTokens.push(token.address)
    indexTokens.push(token.address)
    isLong.push(true)
  }

  for (let i = 0; i < tokens.length; i++) {
    const stableToken = tokens[i]
    if (!stableToken.isStable) {
      continue
    }

    for (let j = 0; j < tokens.length; j++) {
      const token = tokens[j]
      if (token.isStable) {
        continue
      }
      collateralTokens.push(stableToken.address)
      indexTokens.push(token.address)
      isLong.push(false)
    }
  }

  return { collateralTokens, indexTokens, isLong }
}

export function getPositionContractKey(
  account: Address,
  collateralToken: Address,
  indexToken: Address,
  isLong: boolean,
): string {
  return keccak256(
    encodeAbiParameters(parseAbiParameters('address, address, address, bool'), [
      account,
      collateralToken,
      indexToken,
      isLong,
    ]),
  )
}

export function getFundingFee(data: {
  size: bigint
  entryFundingRate?: bigint
  cumulativeFundingRate?: bigint
}) {
  const { entryFundingRate, cumulativeFundingRate, size } = data

  if (entryFundingRate !== undefined && cumulativeFundingRate !== undefined) {
    return mulDiv(
      size,
      cumulativeFundingRate - entryFundingRate,
      BigInt(FUNDING_RATE_PRECISION),
    )
  }

  return
}

export function getDeltaStr({ delta, deltaPercentage, hasProfit }: any) {
  let deltaStr
  let deltaPercentageStr

  if (delta > 0) {
    deltaStr = hasProfit ? '+' : '-'
    deltaPercentageStr = hasProfit ? '+' : '-'
  } else {
    deltaStr = ''
    deltaPercentageStr = ''
  }
  deltaStr += `$${formatAmount(delta, USD_DECIMALS, 2, true)}`
  deltaPercentageStr += `${formatAmount(deltaPercentage, 2, 2)}%`

  return { deltaStr, deltaPercentageStr }
}

function applyPendingChanges(position: any, pendingPositions: any) {
  if (!pendingPositions) {
    return
  }
  const { key } = position

  if (
    pendingPositions[key] &&
    pendingPositions[key].updatedAt &&
    pendingPositions[key].pendingChanges &&
    pendingPositions[key].updatedAt + PENDING_POSITION_VALID_DURATION >
      Date.now()
  ) {
    const { pendingChanges } = pendingPositions[key]
    if (
      pendingChanges.size !== undefined &&
      // biome-ignore lint/suspicious/noDoubleEquals: <explanation>
      position.size == pendingChanges.size
    ) {
      return
    }

    if (
      pendingChanges.expectingCollateralChange &&
      // biome-ignore lint/suspicious/noDoubleEquals: <explanation>
      position.collateral != pendingChanges.collateralSnapshot
    ) {
      return
    }

    position.hasPendingChanges = true
    position.pendingChanges = pendingChanges
  }
}

export function getLeverage({
  size,
  collateral,
  fundingFee,
  hasProfit,
  delta,
  includeDelta,
}: GetLeverageParams) {
  // biome-ignore lint/suspicious/noDoubleEquals: <explanation>
  if (size == undefined || collateral === undefined) {
    return
  }

  let remainingCollateral = collateral

  if (fundingFee !== undefined && fundingFee > 0) {
    remainingCollateral = remainingCollateral - fundingFee
  }

  if (delta !== undefined && includeDelta) {
    if (hasProfit) {
      remainingCollateral = remainingCollateral + delta
    } else {
      if (delta > remainingCollateral) {
        return
      }

      remainingCollateral = remainingCollateral - delta
    }
  }

  // biome-ignore lint/suspicious/noDoubleEquals: <explanation>
  if (remainingCollateral == 0n) {
    return
  }
  return bigMath.mulDiv(size, BASIS_POINTS_DIVISOR_BIGINT, remainingCollateral)
}

export function getLeverageStr(leverage: bigint | undefined) {
  if (leverage !== undefined) {
    if (leverage < 0) {
      return '> 100x'
    }
    return `${formatAmount(leverage, 4, 2, true)}x`
  }

  return ''
}

export function getPositions(
  chainId: any,
  positionQuery: any,
  positionData: any,
  includeDelta: any,
  showPnlAfterFees: any,
  account: any,
  pendingPositions: any,
  updatedPositions: any,
) {
  const propsLength = getConstant(chainId, 'positionReaderPropsLength')
  const positions: any[] = []
  const positionsMap = {}
  if (!positionData) {
    return { positions, positionsMap }
  }
  const { collateralTokens, indexTokens, isLong } = positionQuery
  for (let i = 0; i < collateralTokens.length; i++) {
    const collateralToken = collateralTokens[i]
    const indexToken = indexTokens[i]
    const key = indexTokens[i]

    let contractKey
    if (account) {
      contractKey = getPositionContractKey(
        account,
        collateralTokens[i],
        indexTokens[i],
        isLong[i],
      )
    }

    const position = {
      key,
      contractKey,
      collateralToken,
      indexToken,
      isLong: isLong[i],
      size: positionData[i * propsLength] as bigint,
      collateral: positionData[i * propsLength + 1] as bigint,
      averagePrice: positionData[i * propsLength + 2] as bigint,
      entryFundingRate: positionData[i * propsLength + 3] as bigint,
      cumulativeFundingRate: collateralToken.cumulativeFundingRate as bigint,
      // biome-ignore lint/suspicious/noDoubleEquals: <explanation>
      hasRealisedProfit: positionData[i * propsLength + 4] == 1,
      realisedPnl: positionData[i * propsLength + 5] as bigint,
      lastIncreasedTime: Number(positionData[i * propsLength + 6]),
      // biome-ignore lint/suspicious/noDoubleEquals: <explanation>
      hasProfit: positionData[i * propsLength + 7] == 1,
      delta: positionData[i * propsLength + 8] as bigint,
      markPrice: isLong[i] ? indexToken.minPrice : indexToken.maxPrice,
      fundingFee: 0n,
      collateralAfterFee: 0n,
      closingFee: 0n,
      positionFee: 0n,
      totalFees: 0n,
      pendingDelta: 0n,
      hasPendingChanges: false,
      pendingChanges: null,
      hasLowCollateral: false,
      deltaPercentage: 0n,
      deltaPercentageStr: '',
      deltaStr: '',
      deltaBeforeFeesStr: '',
      deltaAfterFeesStr: '',
      deltaAfterFeesPercentageStr: '',
      hasProfitAfterFees: false,
      pendingDeltaAfterFees: 0n,
      deltaPercentageAfterFees: 0n,
      leverage: 0n as bigint | undefined,
      leverageWithPnl: 0n as bigint | undefined,
      leverageStr: '',
      netValue: 0n,
    }

    if (
      updatedPositions &&
      updatedPositions[key] &&
      updatedPositions[key].updatedAt &&
      updatedPositions[key].updatedAt + UPDATED_POSITION_VALID_DURATION >
        Date.now()
    ) {
      const updatedPosition = updatedPositions[key]
      position.size = updatedPosition.size
      position.collateral = updatedPosition.collateral
      position.averagePrice = updatedPosition.averagePrice
      position.entryFundingRate = updatedPosition.entryFundingRate
    }

    const fundingFee = getFundingFee(position)
    position.fundingFee = fundingFee ? fundingFee : 0n
    position.collateralAfterFee = position.collateral - position.fundingFee

    position.closingFee = bigMath.mulDiv(
      position.size,
      BigInt(MARGIN_FEE_BASIS_POINTS),
      BASIS_POINTS_DIVISOR_BIGINT,
    )
    position.positionFee = bigMath.mulDiv(
      position.size * 2n,
      BigInt(MARGIN_FEE_BASIS_POINTS),
      BASIS_POINTS_DIVISOR_BIGINT,
    )
    position.totalFees = position.positionFee + position.fundingFee

    position.pendingDelta = position.delta

    if (position.collateral > 0) {
      position.hasLowCollateral =
        position.collateralAfterFee < 0 ||
        position.size / bigMath.abs(position.collateralAfterFee) > 50

      if (
        position.averagePrice !== undefined &&
        position.markPrice !== undefined
      ) {
        const priceDelta =
          position.averagePrice > position.markPrice
            ? position.averagePrice - position.markPrice
            : position.markPrice - position.averagePrice
        position.pendingDelta = bigMath.mulDiv(
          position.size,
          priceDelta,
          position.averagePrice,
        )

        position.delta = position.pendingDelta

        if (position.isLong) {
          position.hasProfit = position.markPrice >= position.averagePrice
        } else {
          position.hasProfit = position.markPrice <= position.averagePrice
        }
      }

      position.deltaPercentage = bigMath.mulDiv(
        position.pendingDelta,
        BASIS_POINTS_DIVISOR_BIGINT,
        position.collateral,
      )

      const { deltaStr, deltaPercentageStr } = getDeltaStr({
        delta: position.pendingDelta,
        deltaPercentage: position.deltaPercentage,
        hasProfit: position.hasProfit,
      })

      position.deltaStr = deltaStr
      position.deltaPercentageStr = deltaPercentageStr
      position.deltaBeforeFeesStr = deltaStr

      let hasProfitAfterFees
      let pendingDeltaAfterFees

      if (position.hasProfit) {
        if (position.pendingDelta > position.totalFees) {
          hasProfitAfterFees = true
          pendingDeltaAfterFees = position.pendingDelta - position.totalFees
        } else {
          hasProfitAfterFees = false
          pendingDeltaAfterFees = position.totalFees - position.pendingDelta
        }
      } else {
        hasProfitAfterFees = false
        pendingDeltaAfterFees = position.pendingDelta + position.totalFees
      }

      position.hasProfitAfterFees = hasProfitAfterFees
      position.pendingDeltaAfterFees = pendingDeltaAfterFees
      // while calculating delta percentage after fees, we need to add opening fee (which is equal to closing fee) to collateral
      position.deltaPercentageAfterFees = bigMath.mulDiv(
        position.pendingDeltaAfterFees,
        BASIS_POINTS_DIVISOR_BIGINT,
        position.collateral + position.closingFee,
      )

      const {
        deltaStr: deltaAfterFeesStr,
        deltaPercentageStr: deltaAfterFeesPercentageStr,
      } = getDeltaStr({
        delta: position.pendingDeltaAfterFees,
        deltaPercentage: position.deltaPercentageAfterFees,
        hasProfit: hasProfitAfterFees,
      })

      position.deltaAfterFeesStr = deltaAfterFeesStr
      position.deltaAfterFeesPercentageStr = deltaAfterFeesPercentageStr

      if (showPnlAfterFees) {
        position.deltaStr = position.deltaAfterFeesStr
        position.deltaPercentageStr = position.deltaAfterFeesPercentageStr
      }

      let netValue = position.hasProfit
        ? position.collateral + position.pendingDelta
        : position.collateral - position.pendingDelta

      netValue = netValue - position.fundingFee - position.closingFee
      position.netValue = netValue
    }

    position.leverage = getLeverage({
      size: position.size,
      collateral: position.collateral,
      fundingFee: position.fundingFee,
      hasProfit: position.hasProfit,
      delta: position.delta,
      includeDelta,
    })

    position.leverageWithPnl = getLeverage({
      size: position.size,
      collateral: position.collateral,
      fundingFee: position.fundingFee,
      hasProfit: position.hasProfit,
      delta: position.delta,
      includeDelta: true,
    })
    position.leverageStr = getLeverageStr(position.leverage)

    // @ts-ignore
    positionsMap[key] = position

    applyPendingChanges(position, pendingPositions)

    if (position.size > 0 || position.hasPendingChanges) {
      positions.push(position)
    }
  }

  return { positions, positionsMap }
}
