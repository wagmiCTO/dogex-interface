'use client'

import { analyzePosition } from '@/api/vibe-trader-api'
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
  const [lastRefreshTime, setLastRefreshTime] = useState<number>(0)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [timeRemaining, setTimeRemaining] = useState<number>(0)
  const [isInitialized, setIsInitialized] = useState<boolean>(false)

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

  const refreshAdvice = useCallback(async () => {
    const now = Date.now()
    const timeSinceLastRefresh = now - lastRefreshTime
    const RATE_LIMIT_MS = 10 * 1000 // 10 secs

    if (timeSinceLastRefresh < RATE_LIMIT_MS) {
      return
    }

    setIsLoading(true)
    setLastRefreshTime(now)

    try {
      // First try to analyze position with API
      if (positionData) {
        const analyzeRequest = {
          positionSize: Number(formatUnits(positionData.size, USDC.decimal)),
          entryPrice: Number(formatUnits(positionData.entryPrice, 30)), // Use entryPrice from ContractPosition
          liquidationPrice:
            Number(formatUnits(positionData.entryPrice, 30)) * 0.9, // Estimate liquidation at 90% of entry for testing
          currentPrice:
            Number(formatUnits(positionData.entryPrice, 30)) +
            (currentPositionPnL > 0 ? 100 : -100), // Estimate current price based on PnL
          pnlSize: currentPositionPnL,
        }

        console.log('Sending analyze request:', analyzeRequest) // Debug log

        const response = await analyzePosition(analyzeRequest)

        if (response.success && response.analysis) {
          setCurrentAdvice(response.analysis.aiAdvice)
          setCurrentEmoji('🧠') // AI brain emoji for API responses
          return
        }
      }
    } catch (error) {
      console.warn(
        'Failed to get AI analysis, falling back to local advice:',
        error,
      )
    } finally {
      setIsLoading(false)
    }

    // Fallback to local AI logic
    getAIAdvice()
  }, [positionData, currentPositionPnL, getAIAdvice, lastRefreshTime])

  // Timer effect to update remaining time
  useEffect(() => {
    const interval = setInterval(() => {
      if (lastRefreshTime > 0) {
        const now = Date.now()
        const timeSinceLastRefresh = now - lastRefreshTime
        const RATE_LIMIT_MS = 10 * 1000 // 2.5 minutes
        const remaining = Math.max(0, RATE_LIMIT_MS - timeSinceLastRefresh)
        setTimeRemaining(remaining)
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [lastRefreshTime])

  // Helper function to format time remaining
  const formatTimeRemaining = (ms: number): string => {
    const totalSeconds = Math.ceil(ms / 1000)
    const minutes = Math.floor(totalSeconds / 60)
    const seconds = totalSeconds % 60
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  const isRateLimited = timeRemaining > 0
  const buttonText = isLoading
    ? 'Analyzing...'
    : isRateLimited
      ? `Wait ${formatTimeRemaining(timeRemaining)}`
      : 'Refresh Analysis'

  // Only initialize once on mount, don't auto-update on position changes
  useEffect(() => {
    if (!isInitialized) {
      getAIAdvice()
      setIsInitialized(true)
    }
  }, [getAIAdvice, isInitialized])

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
          disabled={isLoading || isRateLimited}
          className="w-full bg-teal-600 hover:bg-teal-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-medium py-2 px-4 rounded-lg transition-colors"
        >
          {buttonText}
        </Button>

        <p className="text-xs text-gray-500 mt-4">monitoring active position</p>
      </div>
    </div>
  )
}
