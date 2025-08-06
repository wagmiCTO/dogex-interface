import { DOGEX_ABI } from '@/lib/abis/dogex'
import { USDC } from '@/lib/constant'
import { getContract } from '@/lib/contracts'
import type { ContractPosition } from '@/lib/types'
import { calculateLiquidationPrice, formatAmount } from '@/lib/utils'
import { useCallback, useState } from 'react'
import {
  useAccount,
  useWaitForTransactionReceipt,
  useWriteContract,
} from 'wagmi'

interface CurrentPositionProps {
  position: ContractPosition
}

const CurrentPosition = ({ position }: CurrentPositionProps) => {
  const { writeContractAsync, isPending } = useWriteContract()
  const { chainId } = useAccount()
  const [txHash, setTxHash] = useState<`0x${string}` | undefined>()

  const { isLoading: isConfirming } = useWaitForTransactionReceipt({
    hash: txHash,
  })

  const isLoading = !!txHash && isConfirming

  const hasProfit = position.pnl >= 0

  const formattedPostition = {
    ...position,
    entryPrice: formatAmount(position.entryPrice, 8, 6, false),
    collateral: formatAmount(position.collateral, USDC.decimal, 2, false),
    size: formatAmount(position.size, USDC.decimal, 2, false),
    pnl: formatAmount(position.pnl, USDC.decimal, 2, false),
  }

  const dogexAddress = getContract(chainId, 'Dogex')
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  const onClosePosition = useCallback(async () => {
    try {
      const hash = await writeContractAsync({
        abi: DOGEX_ABI,
        address: dogexAddress,
        functionName: 'closePosition',
        args: [],
      })

      setTxHash(hash)
    } catch (error) {
      console.error('Close position failed:', error)
      setTxHash(undefined)
    }
  }, [dogexAddress, writeContractAsync])

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-white mb-6 text-center">
        Your $DOGE Position
      </h3>

      <div className="bg-gray-800/60 border border-gray-600 rounded-xl p-6 space-y-4">
        <div className="text-center">
          <div
            className={`text-3xl font-bold ${hasProfit ? 'text-green-400' : 'text-red-400'}`}
          >
            {formatAmount(position.pnl, USDC.decimal, 2, true)}
          </div>
          <div
            className={`text-lg ${hasProfit ? 'text-green-400' : 'text-red-400'}`}
          >
            {(
              (Number(formattedPostition.pnl) /
                Number(formattedPostition.collateral)) *
              100
            ).toFixed(2)}
            %
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <div className="text-gray-400 mb-1">Entry Price</div>
            <div className="text-white font-medium">
              ${formatAmount(position.entryPrice, 8, 5, true)}
            </div>
          </div>

          <div>
            <div className="text-gray-400 mb-1">Liquidation Price</div>
            <div className="text-white font-medium">
              {calculateLiquidationPrice(
                Number(formattedPostition.entryPrice),
                Number(formattedPostition.collateral),
                Number(formattedPostition.size),
                formattedPostition.isLong,
              ).toFixed(5)}
            </div>
          </div>

          <div>
            <div className="text-gray-400 mb-1">Position Size</div>
            <div className="text-white font-medium">
              ${formatAmount(position.size, USDC.decimal, 2, true)}
            </div>
          </div>

          <div>
            <div className="text-gray-400 mb-1">Paid Amount</div>
            <div className="text-white font-medium">
              ${formatAmount(position.collateral, USDC.decimal, 2, true)}
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center pt-2 border-t border-gray-700">
          <div className="text-sm">
            <span className="text-gray-400">Leverage: </span>
            <span className="text-white font-medium">
              {position.size / position.collateral}x
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
            className="cursor-pointer bg-sky-500 hover:bg-sky-700 disabled:bg-sky-500/50 text-white font-bold py-2 px-6 rounded-lg transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => onClosePosition()}
            disabled={!position.size || isLoading || isPending}
          >
            {isLoading || isPending ? (
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Closing...
              </div>
            ) : (
              'Close Position'
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default CurrentPosition
