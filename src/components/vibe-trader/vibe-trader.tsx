'use client'

import type { ContractPosition } from '@/lib/types'
import { ActivePositionView } from './active-position-view'
import { NonActivePositionView } from './non-active-position-view'

type VibeTraderProps = {
  positionData: ContractPosition | undefined
}

const VibeTrader = ({ positionData }: VibeTraderProps) => {
  const hasActivePosition = !!positionData?.isActive

  return hasActivePosition ? (
    <ActivePositionView positionData={positionData} />
  ) : (
    <NonActivePositionView />
  )
}

export default VibeTrader
