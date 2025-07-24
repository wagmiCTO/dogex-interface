'use client'

import { useOBStore } from '@/store/store'

export const PayAmount = () => {
  const payAmount = useOBStore.use.payAmount()
  const setPayAmount = useOBStore.use.setPayAmount()

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value)

    if (value >= 1 && value <= 1000000) {
      setPayAmount(value)
    } else if (e.target.value === '' || e.target.value === '0') {
      setPayAmount(0)
    }
  }

  return (
    <div className="relative">
      <div className="flex items-center bg-gray-800/50 border border-gray-600 rounded-lg px-4 py-3 focus-within:border-gray-500 transition-colors">
        <span className="text-sm text-gray-400 font-medium mr-3 flex-shrink-0">
          Pay
        </span>

        <input
          type="number"
          value={payAmount}
          onChange={handleAmountChange}
          className="flex-1 bg-transparent text-white text-lg font-bold text-right outline-none placeholder-gray-500
          [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          min="1"
          max="1000000"
          step="0.1"
          placeholder="1.0"
        />

        <span className="text-sm text-gray-300 font-medium ml-3 flex-shrink-0">
          USDC
        </span>
      </div>
    </div>
  )
}
