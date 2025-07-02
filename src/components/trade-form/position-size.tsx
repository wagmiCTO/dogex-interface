'use client'

import { useOBStore } from '@/store/store'

export const PositionSize = () => {
  const positionSize = useOBStore.use.positionSize()

  return (
    <div className="text-center space-y-3 bg-gray-800/50 rounded-xl p-4 border border-gray-700/50">
      <h3 className="text-lg font-medium text-gray-300">Position size</h3>
      <div className="text-2xl font-bold text-white">
        {positionSize.toLocaleString()}{' '}
        <span className="text-gray-300 ml-1">USDC</span>
      </div>
    </div>
  )
}
