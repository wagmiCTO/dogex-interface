'use client'

import CurrentPosition from '@/components/trade-form/current-position/current-position'
import type { ContractPosition } from '@/lib/types'
import { LeverageSlider } from './leverage-slider'
import { PayAmount } from './pay-amount'
import { PositionInfo } from './position-info'
import { TradeDirectionButtons } from './trade-direction-buttons'

type TradeFormProps = {
  positionData: ContractPosition | undefined
}

const TradeForm = ({ positionData }: TradeFormProps) => {
  return (
    <div className="max-w-md mx-auto bg-gray-900 border border-gray-700 rounded-2xl p-6 space-y-6 shadow-2xl backdrop-blur-sm min-w-[320px] md:min-w-[420px]">
      {positionData?.isActive && positionData ? (
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
