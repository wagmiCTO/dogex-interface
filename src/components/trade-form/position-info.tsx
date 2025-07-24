'use client'

import { useOBStore } from '@/store/store'

export const PositionInfo = () => {
  const positionSize = useOBStore.use.positionSize()
  const potentialProfit = useOBStore.use.potentialProfit()
  const leverage = useOBStore.use.leverage()

  return (
    <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50 space-y-4">
      <div className="text-center">
        <h3 className="text-sm text-gray-400 font-medium mb-1">
          Position size
        </h3>
        <div className="text-xl font-bold text-white">
          {positionSize.toLocaleString()}{' '}
          <span className="text-gray-300 text-lg">USDC</span>
        </div>
      </div>

      <div className="border-t border-gray-700/30" />

      <div className="grid grid-cols-2 gap-4 text-sm">
        <div className="text-center">
          <div className="text-gray-400 font-medium mb-1">Potential profit</div>
          <div className="text-[rgba(61,213,152,1)] font-bold">
            {potentialProfit.min}-{potentialProfit.max}$
          </div>
        </div>

        <div className="text-center">
          <div className="text-gray-400 font-medium mb-1">Risk</div>
          <div className="text-gray-300 font-bold">
            {leverage > 50 ? 'High' : leverage > 20 ? 'Medium' : 'Low'}
          </div>
        </div>
      </div>
    </div>
  )
}
