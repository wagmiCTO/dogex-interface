import { simulateContract } from '@wagmi/core'
import { useCallback } from 'react'
import { zeroAddress } from 'viem'
import { arbitrum } from 'viem/chains'
import { useAccount, useWriteContract } from 'wagmi'
import { config } from '@/components/providers/providers'
import { useExecutionFee } from '@/hooks/use-execution-fee'
import { usePrice } from '@/hooks/use-price'
import { POSITION_ROUTER_ABI } from '@/lib/abis/position-router'
import { bigMath } from '@/lib/bigmath'
import { BASIS_POINTS_DIVISOR_BIGINT, USD_DECIMALS } from '@/lib/constant'
import { getContract } from '@/lib/contracts'
import type { Position } from '@/lib/types'
import { formatAmount } from '@/lib/utils'

interface CurrentPositionProps {
  positions: Position[]
}

const CurrentPosition = ({ positions }: CurrentPositionProps) => {
  const { writeContractAsync } = useWriteContract()
  const { minExecutionFee } = useExecutionFee()
  const { currentPrice: markPrice } = usePrice()

  const { address } = useAccount()

  console.log({ positions })

  const onClosePosition = useCallback(async () => {
    const contract = getContract(arbitrum.id, 'PositionRouter')
    const position = positions[0]

    const priceBasisPoints = position.isLong ? 9900 : 10100
    const priceLimit = bigMath.mulDiv(
      BigInt(markPrice ?? 0),
      BigInt(priceBasisPoints),
      BASIS_POINTS_DIVISOR_BIGINT,
    )

    const args = [
      [position.collateralToken], // _path
      position.indexToken, // _indexToken
      0, // _collateralDelta
      position.size, // _sizeDelta
      position.isLong, // _isLong
      address, // _receiver
      priceLimit, // _acceptablePrice
      0, // _minOut
      minExecutionFee, // _executionFee
      false, // _withdrawETH
      zeroAddress, // _callbackTarget
    ]

    try {
      const simulation = await simulateContract(config, {
        abi: POSITION_ROUTER_ABI,
        address: contract,
        functionName: 'createDecreasePosition',
        args,
        chainId: arbitrum.id,
        value: minExecutionFee,
      })
      console.log(simulation)
      // If simulation is successful, send the real tx
      await writeContractAsync({
        abi: POSITION_ROUTER_ABI,
        address: contract,
        functionName: 'createDecreasePosition',
        args,
        value: minExecutionFee,
      })
    } catch (error) {
      console.log({ error })
    }
  }, [address, positions[0], writeContractAsync, minExecutionFee, markPrice])

  if (!positions || positions.length === 0) {
    return null
  }

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-white mb-6 text-center">
        Your Position
      </h3>
      {positions.map((position, index) => {
        const liquidationPrice = position.isLong
          ? position.averagePrice -
            (position.collateral * position.averagePrice) / position.size
          : position.averagePrice +
            (position.collateral * position.averagePrice) / position.size

        const paidAmount = position.collateral

        return (
          <div
            key={index}
            className="bg-gray-800/60 border border-gray-600 rounded-xl p-6 space-y-4"
          >
            <div className="text-center">
              <div
                className={`text-3xl font-bold ${position.hasProfitAfterFees ? 'text-green-400' : 'text-red-400'}`}
              >
                {position.deltaAfterFeesStr}
              </div>
              <div
                className={`text-lg ${position.hasProfitAfterFees ? 'text-green-400' : 'text-red-400'}`}
              >
                {position.deltaAfterFeesPercentageStr}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-gray-400 mb-1">Entry Price</div>
                <div className="text-white font-medium">
                  ${formatAmount(position.averagePrice, USD_DECIMALS, 2, true)}
                </div>
              </div>

              <div>
                <div className="text-gray-400 mb-1">Liquidation Price</div>
                <div className="text-white font-medium">
                  ${formatAmount(liquidationPrice, USD_DECIMALS, 2, true)}
                </div>
              </div>

              <div>
                <div className="text-gray-400 mb-1">Position Size</div>
                <div className="text-white font-medium">
                  ${formatAmount(position.size, USD_DECIMALS, 2, true)}
                </div>
              </div>

              <div>
                <div className="text-gray-400 mb-1">Paid Amount</div>
                <div className="text-white font-medium">
                  ${formatAmount(paidAmount, USD_DECIMALS, 2, true)}
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center pt-2 border-t border-gray-700">
              <div className="text-sm">
                <span className="text-gray-400">Leverage: </span>
                <span className="text-white font-medium">
                  {position.leverageStr}
                </span>
              </div>
              <div className="text-sm">
                <span
                  className={`px-2 py-1 rounded text-xs font-medium ${
                    position.isLong
                      ? 'bg-green-500/20 text-green-400'
                      : 'bg-red-500/20 text-red-400'
                  }`}
                >
                  {position.isLong ? 'LONG' : 'SHORT'}
                </span>
              </div>
            </div>
            <div className="flex justify-center pt-4">
              <button
                className="cursor-pointer bg-sky-500 hover:bg-sky-700 text-white font-bold py-2 px-6 rounded-lg transition-colors duration-150 disabled:opacity-50"
                onClick={() => onClosePosition()}
                disabled={!position.size}
              >
                Close Position
              </button>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default CurrentPosition
