'use client'

import Image from 'next/image'
import { useCallback, useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { useOBStore } from '@/store/store'

// 20 заготовленных AI советов для разных сценариев
const AI_ADVICE = [
  // Высокое плечо (>10x)
  {
    condition: (params: any) => params.leverage > 10,
    advice:
      'Careful! High leverage can lead to quick liquidation. Consider reducing to 5-10x for safer trading.',
    emoji: '⚠️',
  },
  // Очень высокое плечо (>20x)
  {
    condition: (params: any) => params.leverage > 20,
    advice:
      'Extreme leverage! This is gambling, not trading. One wrong tick and your position gets liquidated. Reduce leverage!',
    emoji: '🎰',
  },
  // Низкое плечо (<2x)
  {
    condition: (params: any) => params.leverage < 2,
    advice:
      'Too conservative! With such leverage, profits will be minimal. Try 3-5x for better risk/reward ratio.',
    emoji: '😴',
  },
  // Большая сумма (>1000)
  {
    condition: (params: any) => params.payAmount > 1000,
    advice:
      "Large position! Make sure you're ready for potential losses. Never risk more than you can afford to lose.",
    emoji: '💰',
  },
  // Маленькая сумма (<5)
  {
    condition: (params: any) => params.payAmount < 5,
    advice:
      "Small amounts are great for learning! But don't forget about fees, they can eat your profits.",
    emoji: '🎓',
  },
  // Идеальное плечо (3-5x)
  {
    condition: (params: any) => params.leverage >= 3 && params.leverage <= 5,
    advice:
      'Perfect leverage! 3-5x gives good balance between profit and risk. Sweet spot for most traders.',
    emoji: '👌',
  },
  // Средняя сумма (50-200)
  {
    condition: (params: any) =>
      params.payAmount >= 50 && params.payAmount <= 200,
    advice:
      'Reasonable amount for trading. Enough to gain experience, but not critical for your wallet.',
    emoji: '✅',
  },
  // Высокий потенциал прибыли
  {
    condition: (params: any) => params.potentialProfit.max > 500,
    advice:
      'High profit potential is attractive, but remember - high return = high risk. Be ready for volatility!',
    emoji: '🚀',
  },
  // Низкий потенциал прибыли
  {
    condition: (params: any) => params.potentialProfit.max < 50,
    advice:
      'Modest profit potential. Maybe consider slightly increasing position or leverage for more interesting results?',
    emoji: '📈',
  },
  // Общие советы
  {
    condition: () => Math.random() < 0.15,
    advice:
      'Remember about stop-losses! Better to lock in a small loss than lose your entire deposit.',
    emoji: '🛡️',
  },
  {
    condition: () => Math.random() < 0.15,
    advice:
      "Don't trade on emotions! Cold calculation and clear plan are your best friends in trading.",
    emoji: '🧠',
  },
  {
    condition: () => Math.random() < 0.15,
    advice:
      "Diversification is key to success. Don't put all your eggs in one basket!",
    emoji: '🥚',
  },
  {
    condition: () => Math.random() < 0.15,
    advice:
      'Study the market! Technical analysis helps make more informed decisions.',
    emoji: '📊',
  },
  {
    condition: () => Math.random() < 0.15,
    advice: "Patience is a trader's virtue. Don't rush to enter every trade.",
    emoji: '⏰',
  },
  {
    condition: () => Math.random() < 0.15,
    advice:
      'Keep a trading journal! Analyzing your trades helps you become better.',
    emoji: '📝',
  },
  {
    condition: () => Math.random() < 0.15,
    advice: 'News can strongly affect price. Follow the events calendar!',
    emoji: '📰',
  },
  {
    condition: () => Math.random() < 0.15,
    advice:
      "Don't chase quick money. Consistent profitability is more important than one big trade.",
    emoji: '🏃‍♂️',
  },
  {
    condition: () => Math.random() < 0.15,
    advice:
      'Risk management is 80% of trading success. Position size should match your risk profile.',
    emoji: '⚖️',
  },
  {
    condition: () => Math.random() < 0.15,
    advice: "Psychology matters! Greed and fear are a trader's main enemies.",
    emoji: '😤',
  },
  // Дефолтный совет
  {
    condition: () => true,
    advice:
      'Remember: this is not financial advice! Always do your own research before trading.',
    emoji: '🤖',
  },
]

const VibeTrader = () => {
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
    const params = { payAmount, leverage, positionSize, potentialProfit }

    // Находим первый подходящий совет
    const advice = AI_ADVICE.find((item) => item.condition(params))

    if (advice) {
      setCurrentAdvice(advice.advice)
      setCurrentEmoji(advice.emoji)
    }
  }, [payAmount, leverage, positionSize, potentialProfit])

  const getRandomAdvice = () => {
    const randomIndex = Math.floor(Math.random() * AI_ADVICE.length)
    const advice = AI_ADVICE[randomIndex]
    setCurrentAdvice(advice.advice)
    setCurrentEmoji(advice.emoji)
  }

  const getRandomPosition = () => {
    // Set $10 amount
    setPayAmount(10)

    // Set random leverage between 1x and 50x
    const randomLeverage = Math.floor(Math.random() * 50) + 1
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
        <h2 className="text-xl font-bold text-white mb-4">AI Vibe Trader</h2>

        {/* Изображение */}
        <div className="relative w-48 h-48 mx-auto mb-4">
          <Image
            src="/vibe-trader/vibe-trader.jpg"
            alt="AI Vibe Trader"
            fill
            className="object-cover rounded-lg"
            priority
          />
        </div>

        {/* AI Совет */}
        <div className="bg-gray-800 rounded-lg p-4 mb-4">
          <div className="flex items-start space-x-3">
            <span className="text-2xl flex-shrink-0">{currentEmoji}</span>
            <p className="text-sm text-gray-300 text-left leading-relaxed">
              {currentAdvice}
            </p>
          </div>
        </div>

        {/* Кнопка для получения случайного совета */}
        <Button
          onClick={getRandomPosition}
          className="w-full bg-teal-600 hover:bg-teal-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
        >
          Random AI Position
        </Button>

        {/* Дисклеймер */}
        <p className="text-xs text-gray-500 mt-4">not a financial advice</p>
      </div>
    </div>
  )
}

export default VibeTrader
