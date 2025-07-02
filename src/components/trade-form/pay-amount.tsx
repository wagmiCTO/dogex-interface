'use client'

import { useOBStore } from '@/store/store'

export const PayAmount = () => {
  const payAmount = useOBStore.use.payAmount()
  const setPayAmount = useOBStore.use.setPayAmount()

  return (
    <div className="text-center space-y-3">
      <h3 className="text-lg font-medium text-gray-300">Pay</h3>
      <div className="space-y-2">
        <input
          type="number"
          value={payAmount}
          onChange={(e) => setPayAmount(Number(e.target.value))}
          className="text-3xl font-bold text-center w-full bg-transparent border-none outline-none focus:ring-0 text-white placeholder-gray-500"
          min="0.1"
          step="0.1"
          placeholder="0.0"
        />
        <span className="text-2xl font-bold text-gray-100 tracking-wide">
          USDC
        </span>
      </div>
    </div>
  )
}
