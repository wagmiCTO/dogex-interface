'use client'

import { Button } from '@/components/ui/button'
import { USDC } from '@/lib/constant'
import React, { useCallback, useState } from 'react'
import { erc20Abi, maxUint256 } from 'viem'
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi'

interface UsdcApprovalButtonProps {
  dogexAddress: `0x${string}`
  onApprovalSuccess: () => void
}

export const UsdcApprovalButton = ({
  dogexAddress,
  onApprovalSuccess,
}: UsdcApprovalButtonProps) => {
  const { writeContractAsync } = useWriteContract()
  const [txHash, setTxHash] = useState<`0x${string}` | undefined>()

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash: txHash,
  })

  const isLoading = !!txHash && isConfirming

  const onApproveUSDC = useCallback(async () => {
    try {
      const hash = await writeContractAsync({
        abi: erc20Abi,
        address: USDC.address as `0x${string}`,
        functionName: 'approve',
        args: [dogexAddress, maxUint256],
      })

      setTxHash(hash)
    } catch (error) {
      console.error('Approval failed:', error)
      setTxHash(undefined)
    }
  }, [writeContractAsync, dogexAddress])

  React.useEffect(() => {
    if (isSuccess && txHash) {
      onApprovalSuccess()
      setTxHash(undefined)
    }
  }, [isSuccess, txHash, onApprovalSuccess])

  return (
    <div className="flex gap-4">
      <Button
        onClick={onApproveUSDC}
        disabled={isLoading}
        className="flex-1 h-14 text-lg font-bold bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 disabled:cursor-not-allowed text-white border-none shadow-lg hover:shadow-blue-500/25 transition-all duration-200 hover:scale-105 active:scale-95 disabled:hover:scale-100"
      >
        {isLoading ? (
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            Approving...
          </div>
        ) : (
          'Approve USDC'
        )}
      </Button>
    </div>
  )
}
