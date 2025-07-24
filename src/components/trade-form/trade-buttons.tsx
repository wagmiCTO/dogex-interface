'use client'

import { Button } from '@/components/ui/button'
import { DOGEX_ABI } from '@/lib/abis/dogex'
import { USDC } from '@/lib/constant'
import { useCallback } from 'react'
import { parseUnits } from 'viem'
import { useWriteContract } from 'wagmi'

interface TradeButtonsProps {
  payAmount: number
  leverage: number
  dogexAddress: `0x${string}`
}

export const TradeButtons = ({
  payAmount,
  leverage,
  dogexAddress,
}: TradeButtonsProps) => {
  const { writeContractAsync } = useWriteContract()

  const onOpenPosition = useCallback(
    (isLong: boolean) => {
      writeContractAsync({
        abi: DOGEX_ABI,
        address: dogexAddress,
        functionName: 'openPosition',
        args: [
          parseUnits(String(payAmount), USDC.decimal),
          parseUnits(String(payAmount * leverage), USDC.decimal),
          isLong,
        ],
      })
    },
    [writeContractAsync, payAmount, leverage, dogexAddress],
  )

  const isDisabled = payAmount === 0

  return (
    <div className="flex gap-4">
      <Button
        onClick={() => onOpenPosition(true)}
        disabled={isDisabled}
        className="flex-1 h-14 text-lg font-bold bg-[rgba(61,213,152,1)] hover:bg-[rgba(61,213,152,0.8)] text-white border-none shadow-lg hover:shadow-[rgba(61,213,152,0.25)] transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
      >
        Up
      </Button>

      <Button
        onClick={() => onOpenPosition(false)}
        disabled={isDisabled}
        className="flex-1 h-14 text-lg font-bold bg-[rgba(246,94,93,1)] hover:bg-[rgba(246,94,93,0.8)] text-white border-none shadow-lg hover:shadow-[rgba(246,94,93,0.25)] transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
      >
        Down
      </Button>
    </div>
  )
}
