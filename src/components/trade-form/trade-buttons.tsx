'use client'

import { Button } from '@/components/ui/button'
import { DOGEX_ABI } from '@/lib/abis/dogex'
import { USDC } from '@/lib/constant'
import { useCallback, useState } from 'react'
import { parseUnits } from 'viem'
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi'

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
  const { writeContractAsync, isPending } = useWriteContract()
  const [txHash, setTxHash] = useState<`0x${string}` | undefined>()
  const [pendingDirection, setPendingDirection] = useState<'long' | 'short' | null>(null)

  const { isLoading: isConfirming } = useWaitForTransactionReceipt({
    hash: txHash,
  })

  const isLoading = !!txHash && isConfirming

  const onOpenPosition = useCallback(
    async (isLong: boolean) => {
      try {
        setPendingDirection(isLong ? 'long' : 'short')
        const hash = await writeContractAsync({
          abi: DOGEX_ABI,
          address: dogexAddress,
          functionName: 'openPosition',
          args: [
            parseUnits(String(payAmount), USDC.decimal),
            parseUnits(String(payAmount * leverage), USDC.decimal),
            isLong,
          ],
        })

        setTxHash(hash)
      } catch (error) {
        console.error('Transaction failed:', error)
        setTxHash(undefined)
        setPendingDirection(null)
      }
    },
    [writeContractAsync, payAmount, leverage, dogexAddress],
  )

  const isDisabled = payAmount === 0 || isLoading || isPending

  const renderButtonContent = (direction: 'Up' | 'Down', isLongPosition: boolean) => {
    const isThisButtonLoading = (isLoading || isPending) &&
      ((isLongPosition && pendingDirection === 'long') || (!isLongPosition && pendingDirection === 'short'))

    if (isThisButtonLoading) {
      return (
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          Opening...
        </div>
      )
    }

    return direction
  }

  return (
    <div className="flex gap-4">
      <Button
        onClick={() => onOpenPosition(true)}
        disabled={isDisabled}
        className="flex-1 h-14 text-lg font-bold bg-[rgba(61,213,152,1)] hover:bg-[rgba(61,213,152,0.8)] disabled:bg-[rgba(61,213,152,0.5)] text-white border-none shadow-lg hover:shadow-[rgba(61,213,152,0.25)] transition-all duration-200 hover:scale-105 active:scale-95 disabled:cursor-not-allowed disabled:hover:scale-100"
      >
        {renderButtonContent('Up', true)}
      </Button>

      <Button
        onClick={() => onOpenPosition(false)}
        disabled={isDisabled}
        className="flex-1 h-14 text-lg font-bold bg-[rgba(246,94,93,1)] hover:bg-[rgba(246,94,93,0.8)] disabled:bg-[rgba(246,94,93,0.5)] text-white border-none shadow-lg hover:shadow-[rgba(246,94,93,0.25)] transition-all duration-200 hover:scale-105 active:scale-95 disabled:cursor-not-allowed disabled:hover:scale-100"
      >
        {renderButtonContent('Down', false)}
      </Button>
    </div>
  )
}
