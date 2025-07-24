'use client'

import { Button } from '@/components/ui/button'
import { USDC } from '@/lib/constant'
import type { ContractPosition } from '@/lib/types'
import { useOBStore } from '@/store/store'
import Image from 'next/image'
import { useCallback, useEffect, useState } from 'react'
import { formatUnits } from 'viem'

// Советы для пользователей БЕЗ открытых позиций
const AI_ADVICE_NO_POSITION = [
  // Анализ текущих параметров для скальпинга
  {
    condition: (params: any) => params.leverage < 10,
    advice:
      '1-min scalping detected: Leverage below 10x is too conservative for quick moves. Consider 15-25x for optimal scalping profits.',
    emoji: '⚡',
  },
  {
    condition: (params: any) => params.leverage >= 10 && params.leverage < 20,
    advice:
      'Good scalping leverage! 10-20x range captures micro movements effectively. Perfect for 1-min chart momentum plays.',
    emoji: '🎯',
  },
  {
    condition: (params: any) => params.leverage >= 20 && params.leverage <= 50,
    advice:
      'Excellent scalping setup! 20-50x leverage maximizes profit on small price moves. Ideal for 1-min breakouts and rejections.',
    emoji: '🚀',
  },
  {
    condition: (params: any) => params.leverage > 50,
    advice:
      'EXTREME scalping mode! 50x+ leverage for aggressive 1-min plays. High risk, high reward - perfect for experienced scalpers.',
    emoji: '⚡',
  },
  {
    condition: (params: any) => params.leverage > 70,
    advice:
      'MAXIMUM AGGRESSION: 70x+ leverage for micro-scalping. One tick profits can be huge. Only for expert scalpers with tight stops.',
    emoji: '🔥',
  },
  {
    condition: (params: any) => params.payAmount > 500,
    advice:
      'Large scalping position: On 1-min charts, even $500 with 30x leverage can capture significant moves. Risk management crucial.',
    emoji: '💎',
  },
  {
    condition: (params: any) => params.payAmount < 20,
    advice:
      'Small scalping position: Consider increasing to $20-50 with 25-40x leverage for meaningful 1-min scalping profits.',
    emoji: '📈',
  },

  // Скальпинг стратегии и советы по входу
  {
    condition: () => Math.random() < 0.25,
    advice:
      '1-min chart analysis: Look for wick rejections at support/resistance. Enter with 20-35x leverage for quick scalp profits.',
    emoji: '📊',
  },
  {
    condition: () => Math.random() < 0.25,
    advice:
      'Scalping opportunity: Volume spike detected on 1-min. Consider 25-45x leverage entry on momentum continuation.',
    emoji: '📢',
  },
  {
    condition: () => Math.random() < 0.25,
    advice:
      'Micro-timeframe setup: RSI divergence on 1-min chart. Perfect for 30-50x leverage scalp with tight 2-3 tick stops.',
    emoji: '🎪',
  },
  {
    condition: () => Math.random() < 0.2,
    advice:
      '1-min breakout pattern forming. Prepare 20-40x leverage position for quick breakout scalp. Target 5-10 tick moves.',
    emoji: '💥',
  },
  {
    condition: () => Math.random() < 0.2,
    advice:
      'Scalping window open: Low spread detected. Ideal conditions for 25-60x leverage micro-moves on 1-min chart.',
    emoji: '🪟',
  },
  {
    condition: () => Math.random() < 0.2,
    advice:
      'Order flow imbalance detected on 1-min. Consider aggressive 35-55x leverage for quick liquidity grab scalp.',
    emoji: '🌊',
  },
  {
    condition: () => Math.random() < 0.15,
    advice:
      'High frequency trading window: Market makers stepping back. Perfect for 40-70x leverage scalping opportunities.',
    emoji: '🏃‍♂️',
  },
  {
    condition: () => Math.random() < 0.15,
    advice:
      '1-min chart momentum building. AI suggests 25-45x leverage for capturing micro-trend continuation moves.',
    emoji: '🌪️',
  },
  {
    condition: () => Math.random() < 0.15,
    advice:
      'Scalper alert: Tight consolidation on 1-min. Breakout imminent - prepare 30-50x leverage for explosive move.',
    emoji: '💣',
  },
  {
    condition: () => Math.random() < 0.1,
    advice:
      'Advanced scalping: Neural networks detect optimal entry in next 30-60 seconds. Use 25-40x leverage.',
    emoji: '🧠',
  },
  {
    condition: () => Math.random() < 0.1,
    advice:
      'Speed trading mode: 1-min chart velocity increasing. Quick 20-35x leverage scalp recommended.',
    emoji: '💨',
  },
  {
    condition: () => Math.random() < 0.1,
    advice:
      'Micro-scalping setup: Price action tightening on 1-min. 40-60x leverage for tick-by-tick profit capture.',
    emoji: '🔬',
  },
]

// Советы для пользователей С открытыми позициями
const AI_ADVICE_IN_POSITION = [
  // Прибыльные позиции для скальпинга
  {
    condition: (params: any) => params.currentPositionPnL > 50,
    advice:
      'Scalp profit secured! Quick 1-min move captured. Consider taking 50-75% profits and re-enter on next setup.',
    emoji: '💚',
  },
  {
    condition: (params: any) => params.currentPositionPnL > 100,
    advice:
      'EXCELLENT scalp! Big 1-min move captured with high leverage. Secure 60-80% profits, let remainder run.',
    emoji: '🎉',
  },
  {
    condition: (params: any) =>
      params.currentPositionPnL > 20 && params.currentPositionPnL <= 50,
    advice:
      'Good scalping profit! 1-min move developing. Move stop to breakeven and target next resistance/support.',
    emoji: '📈',
  },
  {
    condition: (params: any) =>
      params.currentPositionPnL > 10 && params.currentPositionPnL <= 20,
    advice:
      'Small scalp profit building. On 1-min chart, even small moves matter with high leverage. Hold for more.',
    emoji: '⚡',
  },

  // Убыточные позиции для скальпинга
  {
    condition: (params: any) => params.currentPositionPnL < -20,
    advice:
      'Scalp going wrong! Cut losses quickly on 1-min chart. High leverage means fast action needed. Exit now!',
    emoji: '🛑',
  },
  {
    condition: (params: any) => params.currentPositionPnL < -50,
    advice:
      'CRITICAL scalping loss! 1-min chart moved against you. Emergency exit required. Preserve capital for next scalp.',
    emoji: '🚨',
  },
  {
    condition: (params: any) =>
      params.currentPositionPnL < -10 && params.currentPositionPnL >= -20,
    advice:
      'Minor scalping drawdown. Normal on 1-min charts with high leverage. Give it 1-2 more candles max.',
    emoji: '⚠️',
  },

  // Нейтральные позиции для скальпинга
  {
    condition: (params: any) => Math.abs(params.currentPositionPnL) <= 10,
    advice:
      'Scalp position neutral. 1-min chart consolidating. High leverage position needs direction soon. Be ready.',
    emoji: '⏳',
  },

  // Советы по направлению позиции для скальпинга
  {
    condition: (params: any) => params.currentPositionDirection === 'LONG',
    advice:
      'LONG scalp active on 1-min. Watch for quick rejection at resistance. Take profits fast on momentum stall.',
    emoji: '🟢',
  },
  {
    condition: (params: any) => params.currentPositionDirection === 'SHORT',
    advice:
      'SHORT scalp running on 1-min. Monitor support breaks. High leverage means quick profits on continuation.',
    emoji: '🔴',
  },

  // Размер позиции в контексте скальпинга
  {
    condition: (params: any) => params.currentPositionSize > 1000,
    advice:
      'Large scalping position with high leverage! Monitor every tick on 1-min chart. Quick profits or quick exit.',
    emoji: '🏗️',
  },
  {
    condition: (params: any) => params.currentPositionSize > 2000,
    advice:
      'MASSIVE scalping exposure! Ultra-high leverage on 1-min chart. Extreme profit potential but manage risk!',
    emoji: '🏭',
  },

  // Специфичные советы для активных скальпинг позиций
  {
    condition: () => Math.random() < 0.2,
    advice:
      'Active scalp on 1-min: Every second counts. Watch price action closely. High leverage amplifies every move.',
    emoji: '👁️',
  },
  {
    condition: () => Math.random() < 0.2,
    advice:
      'Scalping position live: 1-min chart momentum can shift instantly. Be ready for quick exit or profit-taking.',
    emoji: '⚡',
  },
  {
    condition: () => Math.random() < 0.15,
    advice:
      'High leverage scalp running: Time is money on 1-min charts. Dont hold positions too long. Quick in, quick out.',
    emoji: '⏰',
  },
  {
    condition: () => Math.random() < 0.15,
    advice:
      'Tick-by-tick monitoring: Your high leverage position on 1-min chart requires constant attention. Stay focused.',
    emoji: '🎯',
  },
  {
    condition: () => Math.random() < 0.1,
    advice:
      'Advanced scalping mode: Neural networks tracking your 1-min position. Micro-adjustments suggested.',
    emoji: '🕸️',
  },
  {
    condition: () => Math.random() < 0.1,
    advice:
      'Speed trading active: 1-min scalp in progress. High leverage means volatility is your friend. Ride the waves.',
    emoji: '🌊',
  },
  {
    condition: () => Math.random() < 0.1,
    advice:
      'Micro-timeframe position: Every candle matters on 1-min with high leverage. Trust your entry, manage your exit.',
    emoji: '🕯️',
  },
]

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

  const getAIAdvice = useCallback(() => {
    const params = {
      payAmount,
      leverage,
      positionSize,
      potentialProfit,
      currentPositionPnL,
      currentPositionDirection: positionData?.isLong ? 'LONG' : 'SHORT',
      currentPositionSize: positionSize,
    }

    // Выбираем массив советов в зависимости от наличия позиции
    const adviceArray = hasActivePosition
      ? AI_ADVICE_IN_POSITION
      : AI_ADVICE_NO_POSITION

    // Находим первый подходящий совет
    const advice = adviceArray.find((item) => item.condition(params))

    if (advice) {
      setCurrentAdvice(advice.advice)
      setCurrentEmoji(advice.emoji)
    } else {
      // Фоллбэк совет
      const fallback = hasActivePosition
        ? {
            advice:
              'Position monitoring active. AI analysis running in background for optimal exit strategies.',
            emoji: '🔄',
          }
        : {
            advice:
              'Market analysis complete. Neural networks ready to assist with position optimization strategies.',
            emoji: '🤖',
          }
      setCurrentAdvice(fallback.advice)
      setCurrentEmoji(fallback.emoji)
    }
  }, [
    payAmount,
    leverage,
    positionSize,
    potentialProfit,
    hasActivePosition,
    currentPositionPnL,
    positionData?.isLong,
  ])

  const getRandomAdvice = () => {
    const adviceArray = hasActivePosition
      ? AI_ADVICE_IN_POSITION
      : AI_ADVICE_NO_POSITION
    const randomIndex = Math.floor(Math.random() * adviceArray.length)
    const advice = adviceArray[randomIndex]
    setCurrentAdvice(advice.advice)
    setCurrentEmoji(advice.emoji)
  }

  const getRandomPosition = () => {
    // Set random amount between $20-150 for scalping
    const randomAmount = Math.floor(Math.random() * 130) + 20
    setPayAmount(randomAmount)

    // Set random leverage between 10x and 70x with bias towards scalping ranges
    const leverageOptions = [
      10, 15, 20, 20, 25, 25, 30, 30, 35, 40, 45, 50, 55, 60, 70,
    ]
    const randomLeverage =
      leverageOptions[Math.floor(Math.random() * leverageOptions.length)]
    setLeverage(randomLeverage)

    // Also get random advice
    getRandomAdvice()
  }

  useEffect(() => {
    getAIAdvice()
  }, [getAIAdvice])

  return (
    <div className="max-w-md mx-auto bg-gray-900 border border-gray-700 rounded-2xl p-6 space-y-4 shadow-2xl backdrop-blur-sm">
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
          className="w-full bg-teal-600 hover:bg-teal-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
        >
          {hasActivePosition ? 'New AI Analysis' : 'Random AI Position'}
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
