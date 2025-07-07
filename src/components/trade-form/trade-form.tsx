'use client'

import { useMemo } from 'react'
import { useAccount, useChainId, useReadContract } from 'wagmi'
import CurrentPosition from '@/components/trade-form/current-position/current-position'
import {
  getPositionQuery,
  getPositions,
} from '@/components/trade-form/current-position/utils'
import { READER_ABI } from '@/lib/abis/reader'
import { getContract } from '@/lib/contracts'
import { LeverageSlider } from './leverage-slider'
import { PayAmount } from './pay-amount'
import { PositionInfo } from './position-info'
import { TradeDirectionButtons } from './trade-direction-buttons'

const TradeForm = () => {
  const chainId = useChainId()
  const { address } = useAccount()
  const readerAddress = getContract(chainId, 'Reader')
  const vaultAddress = getContract(chainId, 'Vault')

  const positionQuery = getPositionQuery()

  const { data: positionData } = useReadContract({
    address: readerAddress,
    abi: READER_ABI,
    functionName: 'getPositions',
    args: [
      vaultAddress,
      address,
      positionQuery.collateralTokens,
      positionQuery.indexTokens,
      positionQuery.isLong,
    ],
    query: {
      enabled: !!address,
      refetchInterval: 500,
    },
  })

  const { positions } = useMemo(
    () =>
      getPositions(
        chainId,
        positionQuery,
        positionData,
        false,
        false,
        address,
        {},
        {},
      ),
    [address, chainId, positionData, positionQuery],
  )

  const hasPositions = positions && positions.length > 0

  return (
    <div className="max-w-md mx-auto bg-gray-900 border border-gray-700 rounded-2xl p-6 space-y-6 shadow-2xl backdrop-blur-sm">
      {hasPositions ? (
        <CurrentPosition positions={positions} />
      ) : (
        <>
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
