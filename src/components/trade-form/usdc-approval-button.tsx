'use client'

import { Button } from '@/components/ui/button'
import { USDC } from '@/lib/constant'
import { useCallback } from 'react'
import { erc20Abi, maxUint256 } from 'viem'
import { useWriteContract } from 'wagmi'

interface UsdcApprovalButtonProps {
  dogexAddress: `0x${string}`
  onApprovalSuccess: () => void
}

export const UsdcApprovalButton = ({
  dogexAddress,
  onApprovalSuccess,
}: UsdcApprovalButtonProps) => {
  const { writeContractAsync } = useWriteContract()

  const onApproveUSDC = useCallback(async () => {
    await writeContractAsync({
      abi: erc20Abi,
      address: USDC.address as `0x${string}`,
      functionName: 'approve',
      args: [dogexAddress, maxUint256],
    })

    setTimeout(() => onApprovalSuccess(), 5000)
  }, [writeContractAsync, dogexAddress, onApprovalSuccess])

  return (
    <div className="flex gap-4">
      <Button
        onClick={onApproveUSDC}
        className="flex-1 h-14 text-lg font-bold bg-blue-600 hover:bg-blue-700 text-white border-none shadow-lg hover:shadow-blue-500/25 transition-all duration-200 hover:scale-105 active:scale-95"
      >
        Approve USDC
      </Button>
    </div>
  )
}
