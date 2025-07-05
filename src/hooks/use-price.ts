import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { formatUnits } from 'viem'
import { getPrices } from '@/api/gmx-api'
import { ALLOWED_SLIPPAGE, LINK } from '@/lib/constant'

export const usePrice = () => {
  const { data: price } = useQuery({
    queryKey: ['GMXPrices'],
    queryFn: getPrices,
    refetchInterval: 1000,
  })

  const currentPrice = useMemo(() => price?.[LINK.address], [price])

  const numPrice = useMemo(
    () => (currentPrice ? Number(formatUnits(BigInt(currentPrice), 30)) : 0),
    [currentPrice],
  )

  const longPriceWithSlippage = useMemo(
    () => numPrice + numPrice * ALLOWED_SLIPPAGE,
    [numPrice],
  )

  const shortPriceWithSlippage = useMemo(
    () => numPrice - numPrice * ALLOWED_SLIPPAGE,
    [numPrice],
  )

  return {
    longPriceWithSlippage,
    shortPriceWithSlippage,
    numPrice,
    currentPrice,
  }
}
