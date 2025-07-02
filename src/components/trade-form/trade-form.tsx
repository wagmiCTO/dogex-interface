'use client'

import { LeverageSlider } from './leverage-slider'
import { PayAmount } from './pay-amount'
import { PositionInfo } from './position-info'
import { TradeDirectionButtons } from './trade-direction-buttons'

const TradeForm = () => {
  return (
    <div className="max-w-md mx-auto bg-gray-900 border border-gray-700 rounded-2xl p-6 space-y-6 shadow-2xl backdrop-blur-sm">
      {/* Pay Amount Section */}
      <PayAmount />

      {/* Leverage Slider Section */}
      <LeverageSlider />

      {/* Position Info Section */}
      <PositionInfo />

      {/* Trade Direction Buttons */}
      <TradeDirectionButtons />
    </div>
  )
}

export default TradeForm
