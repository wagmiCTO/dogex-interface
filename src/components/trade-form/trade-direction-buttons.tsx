'use client'

import { simulateContract } from '@wagmi/core'
import { useCallback } from 'react'
import { parseUnits, zeroAddress, zeroHash } from 'viem'
import { arbitrum } from 'viem/chains'
import { useChainId, useWriteContract } from 'wagmi'
import { config } from '@/components/providers/providers'
import { Button } from '@/components/ui/button'
import { useExecutionFee } from '@/hooks/use-execution-fee'
import { usePrice } from '@/hooks/use-price'
import { DOGEX_ABI } from '@/lib/abis/dogex'
import { POSITION_ROUTER_ABI } from '@/lib/abis/position-router'
import { LINK, USDC } from '@/lib/constant'
import { getContract } from '@/lib/contracts'
import { useOBStore } from '@/store/store'

export const TradeDirectionButtons = () => {
  const payAmount = useOBStore.use.payAmount()
  const leverage = useOBStore.use.leverage()
  const chainId = useChainId()

  const { writeContractAsync } = useWriteContract()
  const dogexAddress = getContract(chainId, 'Dogex')

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

  return (
    <div className="flex gap-4">
      <Button
        onClick={() => onOpenPosition(true)}
        className="flex-1 h-14 text-lg font-bold bg-[rgba(61,213,152,1)] hover:bg-[rgba(61,213,152,0.8)] text-white border-none shadow-lg hover:shadow-[rgba(61,213,152,0.25)] transition-all duration-200 hover:scale-105 active:scale-95"
      >
        Up
      </Button>

      <Button
        onClick={() => onOpenPosition(false)}
        className="flex-1 h-14 text-lg font-bold bg-[rgba(246,94,93,1)] hover:bg-[rgba(246,94,93,0.8)] text-white border-none shadow-lg hover:shadow-[rgba(246,94,93,0.25)] transition-all duration-200 hover:scale-105 active:scale-95"
      >
        Down
      </Button>
    </div>
  )
}
