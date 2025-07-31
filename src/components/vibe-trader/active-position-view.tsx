'use client'

import { Button } from '@/components/ui/button'
import { USDC } from '@/lib/constant'
import { getFallbackAdvice } from '@/lib/fallback-ai'
import type { ContractPosition } from '@/lib/types'
import { useOBStore } from '@/store/store'
import Image from 'next/image'
import { useCallback, useEffect, useState } from 'react'
import { formatUnits } from 'viem'

type ActivePositionViewProps = {
  positionData: ContractPosition | undefined
}

export const ActivePositionView = ({
  positionData,
}: ActivePositionViewProps) => {
  const currentPositionPnL = Number(
    formatUnits(positionData?.pnl ?? 0n, USDC.decimal),
  )

  const { payAmount, leverage, positionSize, potentialProfit } = useOBStore()

  const [currentAdvice, setCurrentAdvice] = useState<string>('')
  const [currentEmoji, setCurrentEmoji] = useState<string>('🤖')

  const getAIAdvice = useCallback(() => {
    const params = {
      payAmount,
      leverage,
      positionSize,
      potentialProfit:
        typeof potentialProfit === 'object'
          ? potentialProfit.max
          : potentialProfit,
      currentPositionPnL,
      currentPositionDirection: positionData?.isLong ? 'LONG' : 'SHORT',
      currentPositionSize: positionSize,
    }

    // Use only fallback AI logic for active positions
    const fallbackAdvice = getFallbackAdvice(true, params)
    setCurrentAdvice(fallbackAdvice.advice)
    setCurrentEmoji(fallbackAdvice.emoji)
  }, [
    payAmount,
    leverage,
    positionSize,
    potentialProfit,
    currentPositionPnL,
    positionData?.isLong,
  ])

  const refreshAdvice = useCallback(() => {
    getAIAdvice()
  }, [getAIAdvice])

  useEffect(() => {
    getAIAdvice()
  }, [getAIAdvice])

  return (
    <div className="md:max-w-md max-w-[320px] mx-auto bg-gray-900 border border-gray-700 rounded-2xl p-6 space-y-4 shadow-2xl backdrop-blur-sm">
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <h2 className="text-xl font-bold text-white">AI Vibe Trader</h2>
          <div className="text-xs bg-blue-600 text-white px-2 py-1 rounded-full">
            ACTIVE
          </div>
        </div>

        <div className="relative w-48 h-48 mx-auto mb-4">
          <Image
            src="/vibe-trader/vibe-trader.jpg"
            alt="AI Vibe Trader"
            fill
            className="object-cover rounded-lg"
            priority
          />
          <div className="absolute top-2 right-2 w-3 h-3 bg-green-400 rounded-full animate-pulse" />
        </div>

        <div className="bg-gray-800 rounded-lg p-4 mb-4 min-h-[100px]">
          <div className="flex items-start space-x-3">
            <span className="text-2xl flex-shrink-0">{currentEmoji}</span>
            <p className="text-sm text-gray-300 text-left leading-relaxed">
              {currentAdvice}
            </p>
          </div>
        </div>

        <Button
          onClick={refreshAdvice}
          className="w-full bg-teal-600 hover:bg-teal-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
        >
          Refresh Analysis
        </Button>

        <p className="text-xs text-gray-500 mt-4">monitoring active position</p>
      </div>
    </div>
  )
}
