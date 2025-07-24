'use client'
import TradeForm from '@/components/trade-form/trade-form'
import VibeTrader from '@/components/vibe-trader/vibe-trader'
import { DOGEX_ABI } from '@/lib/abis/dogex'
import { getContract } from '@/lib/contracts'
import type { ContractPosition } from '@/lib/types'
import { useAccount, useChainId, useReadContract } from 'wagmi'

const TradeFormWrapper = () => {
  const chainId = useChainId()
  const { address } = useAccount()
  const dogexAddress = getContract(chainId, 'Dogex')

  const { data: positionData } = useReadContract({
    address: dogexAddress,
    abi: DOGEX_ABI,
    functionName: 'getPosition',
    chainId,
    args: [address],
    query: {
      enabled: !!address,
      refetchInterval: 500,
    },
  }) as { data: ContractPosition | undefined }

  return (
    <div className="flex flex-row gap-4">
      <TradeForm positionData={positionData} />
      <VibeTrader positionData={positionData} />
    </div>
  )
}

export default TradeFormWrapper
