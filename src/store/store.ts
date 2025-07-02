import { create } from 'zustand'
import { createSelectors } from '@/store/create-selectors'

interface OBState {
  isSound: boolean
  // Trade form state
  payAmount: number
  leverage: number
  positionSize: number
  potentialProfit: { min: number; max: number }
  liquidationPrice: number
  potentialLoss: number
}

type OBAction = {
  toggleSound: () => void
  // Trade form actions
  setPayAmount: (amount: number) => void
  setLeverage: (leverage: number) => void
  calculatePositionSize: () => void
  calculatePotentialProfit: () => void
  calculateLiquidationPrice: () => void
  calculatePotentialLoss: () => void
  openLongPosition: () => void
  openShortPosition: () => void
}

export const useStore = create<OBState & OBAction>(
  (set, get) =>
    ({
      isSound: true,
      // Trade form initial state
      payAmount: 10,
      leverage: 2,
      positionSize: 1000,
      potentialProfit: { min: 100, max: 200 },
      liquidationPrice: 0,
      potentialLoss: 0,

      toggleSound: () => set((state) => ({ isSound: !state.isSound })),

      setPayAmount: (amount: number) => {
        set({ payAmount: amount })
        get().calculatePositionSize()
        get().calculatePotentialProfit()
        get().calculateLiquidationPrice()
        get().calculatePotentialLoss()
      },

      setLeverage: (leverage: number) => {
        set({ leverage })
        get().calculatePositionSize()
        get().calculatePotentialProfit()
        get().calculateLiquidationPrice()
        get().calculatePotentialLoss()
      },

      calculatePositionSize: () => {
        const { payAmount, leverage } = get()
        const positionSize = payAmount * leverage
        set({ positionSize })
      },

      calculatePotentialProfit: () => {
        const { positionSize } = get()
        // Simplified calculation - в реальном приложении будет более сложная логика
        const min = Math.round(positionSize * 0.1)
        const max = Math.round(positionSize * 0.2)
        set({ potentialProfit: { min, max } })
      },

      calculateLiquidationPrice: () => {
        const { leverage } = get()
        // Упрощенный расчет цены ликвидации
        // В реальном приложении это будет зависеть от текущей цены актива
        const currentPrice = 50000 // Пример цены BTC
        const liquidationDistance = currentPrice / leverage
        set({ liquidationPrice: currentPrice - liquidationDistance })
      },

      calculatePotentialLoss: () => {
        const { payAmount } = get()
        // Максимальный убыток равен размеру залога (pay amount)
        set({ potentialLoss: payAmount })
      },

      openLongPosition: () => {
        const { payAmount, leverage, positionSize } = get()
        console.log('Opening LONG position:', {
          payAmount,
          leverage,
          positionSize,
          direction: 'LONG',
        })
      },

      openShortPosition: () => {
        const { payAmount, leverage, positionSize } = get()
        console.log('Opening SHORT position:', {
          payAmount,
          leverage,
          positionSize,
          direction: 'SHORT',
        })
      },
    }) as const,
)

export const useOBStore = createSelectors(useStore)
