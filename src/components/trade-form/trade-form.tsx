'use client'

import { useAccount, useChainId, useReadContract } from 'wagmi'
import CurrentPosition from '@/components/trade-form/current-position/current-position'
import { DOGEX_ABI } from '@/lib/abis/dogex'
import { getContract } from '@/lib/contracts'
import type { ContractPosition } from '@/lib/types'
import { LeverageSlider } from './leverage-slider'
import { PayAmount } from './pay-amount'
import { PositionInfo } from './position-info'
import { TradeDirectionButtons } from './trade-direction-buttons'

const TradeForm = () => {
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

  const hasPositions = !!positionData?.isActive

  return (
    <div className="max-w-md mx-auto bg-gray-900 border border-gray-700 rounded-2xl p-6 space-y-6 shadow-2xl backdrop-blur-sm">
      {hasPositions && positionData ? (
        <CurrentPosition position={positionData} />
      ) : (
        <>
          <h3 className="text-xl font-bold text-white mb-6 text-center">
            Trade $DOGE
          </h3>
          <PayAmount />
          <LeverageSlider />
          <PositionInfo />
          <TradeDirectionButtons />
        </>
      )}
    </div>
  )
}

export default TradeForm
