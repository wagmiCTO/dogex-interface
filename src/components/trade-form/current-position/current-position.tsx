import { USD_DECIMALS } from '@/lib/constant'
import { formatAmount } from '@/lib/utils'

interface Position {
  deltaStr: string
  deltaPercentageStr: string
  hasProfit: boolean
  averagePrice: bigint
  markPrice: bigint
  size: bigint
  collateral: bigint
  isLong: boolean
  indexToken: any
  leverageStr: string
  netValue: bigint
}

interface CurrentPositionProps {
  positions: Position[]
}

const CurrentPosition = ({ positions }: CurrentPositionProps) => {
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
                className={`text-3xl font-bold ${position.hasProfit ? 'text-green-400' : 'text-red-400'}`}
              >
                {position.deltaStr}
              </div>
              <div
                className={`text-lg ${position.hasProfit ? 'text-green-400' : 'text-red-400'}`}
              >
                {position.deltaPercentageStr}
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
          </div>
        )
      })}
    </div>
  )
}

export default CurrentPosition
