'use client'

import { useOBStore } from '@/store/store'

export const PotentialProfit = () => {
  const potentialProfit = useOBStore.use.potentialProfit()

  return (
    <div className="text-center space-y-3 bg-gray-800/50 rounded-xl p-4 border border-gray-700/50">
      <h3 className="text-lg font-medium text-gray-300">Potential profit</h3>
      <div className="text-2xl font-bold text-[rgba(61,213,152,1)]">
        {potentialProfit.min}-{potentialProfit.max}$
      </div>
    </div>
  )
}
