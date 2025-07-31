'use client'

import { Button } from '@/components/ui/button'
import { USDC } from '@/lib/constant'
import { generateRandomPosition, getFallbackAdvice, getRandomFallbackAdvice } from '@/lib/fallback-ai'
import type { ContractPosition } from '@/lib/types'
import { useOBStore } from '@/store/store'
import { useQuery } from '@tanstack/react-query'
import Image from 'next/image'
import { useCallback, useEffect, useState } from 'react'
import { formatUnits } from 'viem'
import { fetchPositionData } from '@/api/vibe-trader-api'

type VibeTraderProps = {
  positionData: ContractPosition | undefined
}

const VibeTrader = ({ positionData }: VibeTraderProps) => {
  const hasActivePosition = !!positionData?.isActive
  const currentPositionPnL = Number(
    formatUnits(positionData?.pnl ?? 0n, USDC.decimal),
  )

  const {
    payAmount,
    leverage,
    positionSize,
    potentialProfit,
    setPayAmount,
    setLeverage,
  } = useOBStore()

  const [currentAdvice, setCurrentAdvice] = useState<string>('')
  const [currentEmoji, setCurrentEmoji] = useState<string>('🤖')
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [lastRequestTime, setLastRequestTime] = useState<number>(0)
  const [timeUntilNextRequest, setTimeUntilNextRequest] = useState<number>(0)

  // Update countdown timer
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now()
      const timeSinceLastRequest = now - lastRequestTime
      const remainingTime = Math.max(0, 60000 - timeSinceLastRequest) // 60 seconds = 60000ms
      setTimeUntilNextRequest(remainingTime)
    }, 1000)

    return () => clearInterval(interval)
  }, [lastRequestTime])

  // Fetch position data from API
  const { data: positionResponse, refetch: refetchPosition } = useQuery({
    queryKey: ['position'],
    queryFn: fetchPositionData,
    refetchOnWindowFocus: false,
    enabled: false, // Only fetch when manually triggered
    retry: false, // Don't retry on failure, use fallback instead
  })

  const getAIAdvice = useCallback(() => {
    const params = {
      payAmount,
      leverage,
      positionSize,
      potentialProfit: typeof potentialProfit === 'object' ? potentialProfit.max : potentialProfit,
      currentPositionPnL,
      currentPositionDirection: positionData?.isLong ? 'LONG' : 'SHORT',
      currentPositionSize: positionSize,
    }

    // Use API response if available
    if (positionResponse?.position) {
      setCurrentAdvice(positionResponse.position)
      setCurrentEmoji('🤖') // Default emoji since API doesn't provide it
    } else {
      // Use fallback AI logic
      const fallbackAdvice = getFallbackAdvice(hasActivePosition, params)
      setCurrentAdvice(fallbackAdvice.advice)
      setCurrentEmoji(fallbackAdvice.emoji)
    }
  }, [
    payAmount,
    leverage,
    positionSize,
    potentialProfit,
    hasActivePosition,
    currentPositionPnL,
    positionData?.isLong,
    positionResponse,
  ])

  const getRandomPosition = useCallback(async () => {
    const now = Date.now()
    const timeSinceLastRequest = now - lastRequestTime
    const oneMinute = 60000 // 60 seconds in milliseconds

    // Check if enough time has passed since last request
    if (timeSinceLastRequest < oneMinute) {
      return // Don't make request if less than 1 minute has passed
    }

    setIsLoading(true)
    setLastRequestTime(now)

    try {
      // Try to fetch from API first
      const result = await refetchPosition()

      if (result.data) {
        // Set leverage from API response
        if (result.data.leverage) {
          setLeverage(result.data.leverage)
        }

        // Update advice from API response
        if (result.data.position) {
          setCurrentAdvice(result.data.position)
          setCurrentEmoji('🤖') // Default emoji since API doesn't provide it
        }
      } else {
        throw new Error('No data from API')
      }
    } catch {
      // Fallback to random values and advice
      const randomPosition = generateRandomPosition()
      setPayAmount(randomPosition.payAmount)
      setLeverage(randomPosition.leverage)

      // Get random fallback advice
      const randomAdvice = getRandomFallbackAdvice(hasActivePosition)
      setCurrentAdvice(randomAdvice.advice)
      setCurrentEmoji(randomAdvice.emoji)
    } finally {
      setIsLoading(false)
    }
  }, [refetchPosition, setPayAmount, setLeverage, hasActivePosition, lastRequestTime])

  useEffect(() => {
    getAIAdvice()
  }, [getAIAdvice])

  return (
    <div className="md:max-w-md max-w-[320px] mx-auto bg-gray-900 border border-gray-700 rounded-2xl p-6 space-y-4 shadow-2xl backdrop-blur-sm">
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <h2 className="text-xl font-bold text-white">AI Vibe Trader</h2>
          {hasActivePosition && (
            <div className="text-xs bg-blue-600 text-white px-2 py-1 rounded-full">
              ACTIVE
            </div>
          )}
        </div>

        <div className="relative w-48 h-48 mx-auto mb-4">
          <Image
            src="/vibe-trader/vibe-trader.jpg"
            alt="AI Vibe Trader"
            fill
            className="object-cover rounded-lg"
            priority
          />
          {hasActivePosition && (
            <div className="absolute top-2 right-2 w-3 h-3 bg-green-400 rounded-full animate-pulse" />
          )}
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
          onClick={getRandomPosition}
          className="w-full bg-teal-600 hover:bg-teal-700 text-white font-medium py-2 px-4 rounded-lg transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed"
          disabled={isLoading || timeUntilNextRequest > 0}
        >
          {isLoading
            ? 'Loading...'
            : timeUntilNextRequest > 0
            ? `Wait ${Math.ceil(timeUntilNextRequest / 1000)}s`
            : hasActivePosition
            ? 'New AI Analysis'
            : 'Random AI Position'}
        </Button>

        <p className="text-xs text-gray-500 mt-4">
          {hasActivePosition
            ? 'monitoring active position'
            : 'not financial advice'}
        </p>
      </div>
    </div>
  )
}

export default VibeTrader
