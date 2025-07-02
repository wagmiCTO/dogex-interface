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
          className="text-3xl font-bold text-center w-full bg-gray-800/50 border border-gray-600 rounded-lg px-4 py-2 outline-none focus:border-gray-500 text-white placeholder-gray-500
          [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
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
