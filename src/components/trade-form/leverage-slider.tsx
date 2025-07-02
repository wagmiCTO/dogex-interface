'use client'

import { Slider } from '@/components/ui/slider'
import { useOBStore } from '@/store/store'

export const LeverageSlider = () => {
  const leverage = useOBStore.use.leverage()
  const setLeverage = useOBStore.use.setLeverage()

  // Эмоциональные цвета в зависимости от уровня рычага с кастомными цветами
  const getLeverageColor = (lev: number) => {
    if (lev <= 10) return 'text-[rgba(61,213,152,1)]' // --color-green
    if (lev <= 30) return 'text-yellow-400'
    if (lev <= 50) return 'text-orange-400'
    return 'text-[rgba(246,94,93,1)]' // --color-red
  }

  const getRiskLevel = (lev: number) => {
    if (lev <= 10) return 'Low'
    if (lev <= 30) return 'Medium'
    if (lev <= 50) return 'High'
    return 'EXTREME'
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-300">Leverage</h3>
        <div className="flex items-center gap-2">
          <span className={`text-xl font-bold ${getLeverageColor(leverage)}`}>
            {leverage}x
          </span>
          <span className="text-xs text-gray-500 font-medium">
            {getRiskLevel(leverage)}
          </span>
        </div>
      </div>

      <div className="px-4">
        <Slider
          value={[leverage]}
          onValueChange={(value) => setLeverage(value[0])}
          min={2}
          max={100}
          step={1}
          className="w-full [&_[data-slot=slider-track]]:bg-gray-700 [&_[data-slot=slider-range]]:bg-[rgba(61,213,152,1)] [&_[data-slot=slider-thumb]]:bg-gray-800 [&_[data-slot=slider-thumb]]:border-[rgba(61,213,152,1)] [&_[data-slot=slider-thumb]]:ring-[rgba(61,213,152,0.3)]"
        />
      </div>

      <div className="flex justify-between text-sm px-4">
        <span className="text-gray-400">2x</span>
        <span className="text-gray-400">100x</span>
      </div>
    </div>
  )
}
