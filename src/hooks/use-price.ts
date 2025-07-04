import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { formatUnits } from 'viem'
import { getPrices } from '@/api/gmx-api'
import { ALLOWED_SLIPPAGE, LINK } from '@/lib/constant'

export const usePrice = () => {
  const { data: price } = useQuery({
    queryKey: ['GMXPrices'],
    queryFn: getPrices,
  })

  const currentPrice = useMemo(() => price?.[LINK.address], [price])

  const numPrice = currentPrice
    ? Number(formatUnits(BigInt(currentPrice), 30))
    : 0

  const priceWithSlippage = numPrice + numPrice * ALLOWED_SLIPPAGE

  return { priceWithSlippage, numPrice, currentPrice }
}
