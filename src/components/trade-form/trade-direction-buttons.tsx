'use client'

import { Button } from '@/components/ui/button'
import { useOBStore } from '@/store/store'

export const TradeDirectionButtons = () => {
  const openLongPosition = useOBStore.use.openLongPosition()
  const openShortPosition = useOBStore.use.openShortPosition()

  return (
    <div className="flex gap-4">
      <Button
        onClick={openLongPosition}
        className="flex-1 h-14 text-lg font-bold bg-[rgba(61,213,152,1)] hover:bg-[rgba(61,213,152,0.8)] text-white border-none shadow-lg hover:shadow-[rgba(61,213,152,0.25)] transition-all duration-200 hover:scale-105 active:scale-95"
      >
        <span className="flex items-center gap-2">Up</span>
      </Button>

      <Button
        onClick={openShortPosition}
        className="flex-1 h-14 text-lg font-bold bg-[rgba(246,94,93,1)] hover:bg-[rgba(246,94,93,0.8)] text-white border-none shadow-lg hover:shadow-[rgba(246,94,93,0.25)] transition-all duration-200 hover:scale-105 active:scale-95"
      >
        <span className="flex items-center gap-2">Down</span>
      </Button>
    </div>
  )
}
