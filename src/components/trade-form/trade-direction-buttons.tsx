'use client'

import { USDC } from '@/lib/constant'
import { getContract } from '@/lib/contracts'
import { useOBStore } from '@/store/store'
import { erc20Abi, parseUnits } from 'viem'
import { useAccount, useChainId, useReadContract } from 'wagmi'
import { TradeButtons } from './trade-buttons'
import { UsdcApprovalButton } from './usdc-approval-button'

export const TradeDirectionButtons = () => {
  const payAmount = useOBStore.use.payAmount()
  const leverage = useOBStore.use.leverage()
  const chainId = useChainId()
  const { address } = useAccount()

  const dogexAddress = getContract(chainId, 'Dogex')

  const { data: allowance, refetch: refetchAllowance } = useReadContract({
    abi: erc20Abi,
    address: USDC.address as `0x${string}`,
    functionName: 'allowance',
    args: address && dogexAddress ? [address, dogexAddress] : undefined,
    query: {
      enabled: !!address && !!dogexAddress,
    },
  })

  const requiredAmount = parseUnits(String(payAmount), USDC.decimal)
  const needsApproval =
    (allowance !== undefined && allowance < requiredAmount) ||
    allowance === undefined

  const handleApprovalSuccess = () => {
    refetchAllowance()
  }

  if (needsApproval) {
    return (
      <UsdcApprovalButton
        dogexAddress={dogexAddress}
        onApprovalSuccess={handleApprovalSuccess}
      />
    )
  }

  return (
    <TradeButtons
      payAmount={payAmount}
      leverage={leverage}
      dogexAddress={dogexAddress}
    />
  )
}
