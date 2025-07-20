import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { formatUnits } from 'viem'
import type { BigNumberish } from './types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function roundWithDecimals(
  value: BigNumberish,
  opts: { displayDecimals: number; decimals: number },
): bigint {
  if (opts.displayDecimals === opts.decimals) {
    return BigInt(value)
  }

  let valueString = value.toString()
  let isNegative = false

  if (valueString[0] === '-') {
    valueString = valueString.slice(1)
    isNegative = true
  }

  if (valueString.length < opts.decimals) {
    valueString = valueString.padStart(opts.decimals, '0')
  }

  const mainPart = valueString.slice(
    0,
    valueString.length - opts.decimals + opts.displayDecimals,
  )
  const partToRound = valueString.slice(
    valueString.length - opts.decimals + opts.displayDecimals,
  )

  let mainPartBigInt = BigInt(mainPart)

  let returnValue = mainPartBigInt

  if (partToRound.length !== 0) {
    if (Number(partToRound[0]) >= 5) {
      mainPartBigInt += 1n
    }

    returnValue = BigInt(
      mainPartBigInt.toString() +
        new Array(partToRound.length).fill('0').join(''),
    )
  }

  return isNegative ? returnValue * -1n : returnValue
}

export const limitDecimals = (amount: BigNumberish, maxDecimals?: number) => {
  let amountStr = amount.toString()
  if (maxDecimals === undefined) {
    return amountStr
  }
  if (maxDecimals === 0) {
    return amountStr.split('.')[0]
  }
  const dotIndex = amountStr.indexOf('.')
  if (dotIndex !== -1) {
    const decimals = amountStr.length - dotIndex - 1
    if (decimals > maxDecimals) {
      amountStr = amountStr.substr(
        0,
        amountStr.length - (decimals - maxDecimals),
      )
    }
  }

  return amountStr
}

export const padDecimals = (amount: BigNumberish, minDecimals: number) => {
  let amountStr = amount.toString()
  const dotIndex = amountStr.indexOf('.')
  if (dotIndex !== -1) {
    const decimals = amountStr.length - dotIndex - 1
    if (decimals < minDecimals) {
      amountStr = amountStr.padEnd(
        amountStr.length + (minDecimals - decimals),
        '0',
      )
    }
  } else {
    amountStr = amountStr + '.' + '0'.repeat(minDecimals)
  }
  return amountStr
}

export function numberWithCommas(x: BigNumberish) {
  if (x === undefined || x === null) {
    return '...'
  }

  const parts = x.toString().split('.')
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  return parts.join('.')
}

export const formatAmount = (
  amount: BigNumberish | undefined,
  tokenDecimals: number,
  displayDecimals?: number,
  useCommas?: boolean,
  defaultValue?: string,
  visualMultiplier?: number,
) => {
  if (defaultValue === undefined || defaultValue === null) {
    defaultValue = '...'
  }
  if (amount === undefined || amount === null || amount === '') {
    return defaultValue
  }
  if (displayDecimals === undefined) {
    displayDecimals = 4
  }
  const amountBigInt = roundWithDecimals(
    BigInt(amount) * BigInt(visualMultiplier ?? 1),
    {
      displayDecimals,
      decimals: tokenDecimals,
    },
  )
  let amountStr = formatUnits(amountBigInt, tokenDecimals)
  amountStr = limitDecimals(amountStr, displayDecimals)
  if (displayDecimals !== 0) {
    amountStr = padDecimals(amountStr, displayDecimals)
  }
  if (useCommas) {
    return numberWithCommas(amountStr)
  }
  return amountStr
}

export const calculateLiquidationPrice = (
  entryPrice: number,
  collateral: number,
  size: number,
  isLong: boolean,
): number => {
  const liquidationThreshold = 0.9

  const riskFactor = (liquidationThreshold * collateral) / size

  console.log({
    t1: liquidationThreshold * collateral,
    t2: size,
    t3: riskFactor,
  })

  if (isLong) {
    return entryPrice * (1 - riskFactor)
  } else {
    return entryPrice * (1 + riskFactor)
  }
}
