'use client'

import { useOBStore } from '@/store/store'

export const PotentialProfit = () => {
  const potentialProfit = useOBStore.use.potentialProfit()

  return (
    <div className="text-center space-y-2">
      <div className="text-sm text-gray-400 font-medium">
        Potential profit:
        <span className="text-[rgba(61,213,152,1)] font-bold ml-1">
          {potentialProfit.min}-{potentialProfit.max}$
        </span>
        <span className="text-xs text-gray-500 ml-2">💰</span>
      </div>
    </div>
  )
}
