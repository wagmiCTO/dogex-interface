'use client'

import Image from 'next/image'
import { useCallback, useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { useOBStore } from '@/store/store'

// Советы для пользователей БЕЗ открытых позиций
const AI_ADVICE_NO_POSITION = [
  // Анализ текущих параметров
  {
    condition: (params: any) => params.leverage > 15,
    advice:
      'Neural network analysis suggests reducing leverage to 5-10x. High leverage increases liquidation risk by 340% based on historical data.',
    emoji: '🧠',
  },
  {
    condition: (params: any) => params.leverage > 25,
    advice:
      'CRITICAL: Leverage exceeding 25x shows 89% liquidation rate within 24h. AI recommendation: immediate risk reduction.',
    emoji: '🚨',
  },
  {
    condition: (params: any) => params.leverage < 3,
    advice:
      'Conservative approach detected. Market volatility suggests 3-5x leverage could optimize risk-adjusted returns by 45%.',
    emoji: '📊',
  },
  {
    condition: (params: any) => params.payAmount > 500,
    advice:
      'Large position alert: Risk management protocols suggest position sizing at 2-5% of portfolio. Confirm risk tolerance.',
    emoji: '⚖️',
  },
  {
    condition: (params: any) => params.payAmount < 10,
    advice:
      'Micro-position detected. Trading fees may consume 15-25% of potential profits. Consider position sizing optimization.',
    emoji: '🔬',
  },
  {
    condition: (params: any) => params.leverage >= 4 && params.leverage <= 8,
    advice:
      'Optimal leverage range identified. Risk-reward ratio analysis shows 67% higher success rate in this range.',
    emoji: '✅',
  },

  // Рыночные условия и советы по входу
  {
    condition: () => Math.random() < 0.2,
    advice:
      'Market sentiment analysis: Current volatility suggests waiting for clearer directional signals before entry.',
    emoji: '🌊',
  },
  {
    condition: () => Math.random() < 0.2,
    advice:
      'Technical indicators show potential reversal zones. Consider DCA strategy for position building.',
    emoji: '📈',
  },
  {
    condition: () => Math.random() < 0.2,
    advice:
      'Volume analysis indicates institutional accumulation. Bullish bias with 62% confidence level.',
    emoji: '🐂',
  },
  {
    condition: () => Math.random() < 0.2,
    advice:
      'Correlation matrix shows DOGE following broader crypto trends. Monitor BTC dominance for entry timing.',
    emoji: '🔗',
  },
  {
    condition: () => Math.random() < 0.15,
    advice:
      'Support/resistance levels updated. Key zones identified at $0.195 and $0.235 for optimal entry points.',
    emoji: '🎯',
  },
  {
    condition: () => Math.random() < 0.15,
    advice:
      'Funding rates analysis suggests long positions currently cost 0.05% per 8h. Factor into strategy.',
    emoji: '💰',
  },

  // Общие AI советы для входа
  {
    condition: () => Math.random() < 0.1,
    advice:
      'AI pattern recognition: Similar setups historically showed 58% success rate. Proceed with calculated risk.',
    emoji: '🤖',
  },
  {
    condition: () => Math.random() < 0.1,
    advice:
      'Machine learning model suggests optimal entry window in next 2-4 hours based on volatility patterns.',
    emoji: '⏰',
  },
]

// Советы для пользователей С открытыми позициями
const AI_ADVICE_IN_POSITION = [
  // Прибыльные позиции
  {
    condition: (params: any) => params.currentPositionPnL > 50,
    advice:
      'Position showing strong profit! Consider taking partial profits (25-50%) and moving stop-loss to breakeven.',
    emoji: '💚',
  },
  {
    condition: (params: any) => params.currentPositionPnL > 100,
    advice:
      'Excellent performance! Risk management suggests securing 30-40% profits. Let remaining position ride with trailing stop.',
    emoji: '🚀',
  },
  {
    condition: (params: any) =>
      params.currentPositionPnL > 20 && params.currentPositionPnL <= 50,
    advice:
      'Modest gains detected. Consider adjusting stop-loss to +5% to protect capital while allowing upside.',
    emoji: '📈',
  },

  // Убыточные позиции
  {
    condition: (params: any) => params.currentPositionPnL < -30,
    advice:
      'Position in red zone. Cut losses at -40% or add to position only if conviction remains high. Risk management crucial.',
    emoji: '🔴',
  },
  {
    condition: (params: any) => params.currentPositionPnL < -50,
    advice:
      'CRITICAL: Heavy losses detected. Consider immediate exit or hedge with opposite position. Preserve capital for next opportunity.',
    emoji: '⛑️',
  },
  {
    condition: (params: any) =>
      params.currentPositionPnL < -10 && params.currentPositionPnL >= -30,
    advice:
      'Minor drawdown within normal range. Hold conviction but prepare exit strategy if -35% level breached.',
    emoji: '⚠️',
  },

  // Нейтральные позиции
  {
    condition: (params: any) => Math.abs(params.currentPositionPnL) <= 10,
    advice:
      'Position consolidating near entry. Patience required. Market may be building energy for next directional move.',
    emoji: '⏳',
  },

  // Советы по направлению позиции
  {
    condition: (params: any) => params.currentPositionDirection === 'LONG',
    advice:
      'LONG position active. Monitor resistance levels and consider profit-taking near previous highs. Bullish momentum tracking.',
    emoji: '🟢',
  },
  {
    condition: (params: any) => params.currentPositionDirection === 'SHORT',
    advice:
      'SHORT position active. Watch for support breaks and potential capitulation signals. Bearish sentiment confirmed.',
    emoji: '🔴',
  },

  // Размер позиции в контексте
  {
    condition: (params: any) => params.currentPositionSize > 1000,
    advice:
      'Large position exposure detected. Consider hedging strategies or gradual profit-taking to manage concentration risk.',
    emoji: '🏗️',
  },

  // Общие советы для активных позиций
  {
    condition: () => Math.random() < 0.15,
    advice:
      'Active position requires monitoring. Set alerts at key levels and avoid emotional decision-making.',
    emoji: '👁️',
  },
  {
    condition: () => Math.random() < 0.15,
    advice:
      'Time decay working. Consider position duration vs initial strategy. Markets reward patience but punish stubbornness.',
    emoji: '⌛',
  },
  {
    condition: () => Math.random() < 0.1,
    advice:
      'Neural networks suggest correlation changes ahead. Monitor broader market conditions for position adjustments.',
    emoji: '🕸️',
  },
]

const VibeTrader = () => {
  const {
    payAmount,
    leverage,
    positionSize,
    potentialProfit,
    hasActivePosition,
    currentPositionPnL,
    currentPositionDirection,
    currentPositionSize,
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
      currentPositionDirection,
      currentPositionSize,
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
    currentPositionDirection,
    currentPositionSize,
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
    // Set random amount between $10-100
    const randomAmount = Math.floor(Math.random() * 90) + 10
    setPayAmount(randomAmount)

    // Set random leverage between 2x and 20x with bias towards safer ranges
    const leverageOptions = [2, 3, 4, 5, 5, 6, 7, 8, 10, 12, 15, 20]
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
            <div className="absolute top-2 right-2 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
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
