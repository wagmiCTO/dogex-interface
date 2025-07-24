'use client'

import { Button } from '@/components/ui/button'
import { USDC } from '@/lib/constant'
import { getContract } from '@/lib/contracts'
import { useOBStore } from '@/store/store'
import { useRouter } from 'next/navigation'
import { erc20Abi, formatUnits, parseUnits } from 'viem'
import { useAccount, useChainId, useReadContract } from 'wagmi'
import { TradeButtons } from './trade-buttons'
import { UsdcApprovalButton } from './usdc-approval-button'

export const TradeDirectionButtons = () => {
  const payAmount = useOBStore.use.payAmount()
  const leverage = useOBStore.use.leverage()
  const chainId = useChainId()
  const { address } = useAccount()
  const router = useRouter()

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

  const { data: balance } = useReadContract({
    abi: erc20Abi,
    address: USDC.address as `0x${string}`,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  })

  const usdcBalance = balance ? Number(formatUnits(balance, USDC.decimal)) : 0
  const hasLowBalance = usdcBalance < 100

  const requiredAmount = parseUnits(String(payAmount), USDC.decimal)
  const needsApproval =
    (allowance !== undefined && allowance < requiredAmount) ||
    allowance === undefined

  const handleApprovalSuccess = () => {
    refetchAllowance()
  }

  const handleMintClick = () => {
    router.push('/mint')
  }

  if (hasLowBalance && address) {
    return (
      <div className="space-y-3">
        <div className="text-center text-sm text-yellow-400 bg-yellow-400/10 p-2 rounded">
          Low USDC balance: {usdcBalance.toFixed(2)} USDC
        </div>
        <Button
          onClick={handleMintClick}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
        >
          Mint USDC
        </Button>
      </div>
    )
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
