'use client'

import { fetchPositionData } from '@/api/vibe-trader-api'
import { Button } from '@/components/ui/button'
import {
  generateRandomPosition,
  getRandomFallbackAdvice,
} from '@/lib/fallback-ai'
import { useOBStore } from '@/store/store'
import { useQuery } from '@tanstack/react-query'
import Image from 'next/image'
import { useCallback, useEffect, useState } from 'react'

export const NonActivePositionView = () => {
  const { setPayAmount, setLeverage } = useOBStore()
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
  const { refetch: refetchPosition } = useQuery({
    queryKey: ['position'],
    queryFn: fetchPositionData,
    refetchOnWindowFocus: false,
    enabled: false, // Only fetch when manually triggered
    retry: false, // Don't retry on failure, use fallback instead
  })

  const onRandomPosition = useCallback(async () => {
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

      // Get random fallback advice for non-active position
      const randomAdvice = getRandomFallbackAdvice(false)
      setCurrentAdvice(randomAdvice.advice)
      setCurrentEmoji(randomAdvice.emoji)
    } finally {
      setIsLoading(false)
    }
  }, [refetchPosition, setPayAmount, setLeverage, lastRequestTime])

  // Initialize with default advice on mount
  useEffect(() => {
    const initialAdvice = getRandomFallbackAdvice(false)
    setCurrentAdvice(initialAdvice.advice)
    setCurrentEmoji(initialAdvice.emoji)
  }, [])

  return (
    <div className="md:max-w-md max-w-[320px] mx-auto bg-gray-900 border border-gray-700 rounded-2xl p-6 space-y-4 shadow-2xl backdrop-blur-sm">
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <h2 className="text-xl font-bold text-white">AI Vibe Trader</h2>
        </div>

        <p className="text-xs text-gray-400 mb-4">
          Powered by{' '}
          <a
            href="https://lazai.network/alith"
            target="_blank"
            rel="noopener noreferrer"
            className="text-teal-400 hover:text-teal-300 underline"
          >
            Alith AI
          </a>
        </p>

        <div className="relative w-48 h-48 mx-auto mb-4">
          <Image
            src="/vibe-trader/vibe-trader.jpg"
            alt="AI Vibe Trader"
            fill
            className="object-cover rounded-lg"
            priority
          />
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
          onClick={onRandomPosition}
          className="w-full bg-teal-600 hover:bg-teal-700 text-white font-medium py-2 px-4 rounded-lg transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed"
          disabled={isLoading || timeUntilNextRequest > 0}
        >
          {isLoading
            ? 'Loading...'
            : timeUntilNextRequest > 0
              ? `Wait ${Math.ceil(timeUntilNextRequest / 1000)}s`
              : 'Random AI Position'}
        </Button>

        <p className="text-xs text-gray-500 mt-4">not financial advice</p>
      </div>
    </div>
  )
}
