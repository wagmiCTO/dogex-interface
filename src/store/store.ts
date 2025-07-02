import { create } from 'zustand'
import { createSelectors } from '@/store/create-selectors'

interface OBState {
  isSound: boolean
  // Trade form state
  payAmount: number
  leverage: number
  positionSize: number
  potentialProfit: { min: number; max: number }
}

type OBAction = {
  toggleSound: () => void
  // Trade form actions
  setPayAmount: (amount: number) => void
  setLeverage: (leverage: number) => void
  calculatePositionSize: () => void
  calculatePotentialProfit: () => void
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

      toggleSound: () => set((state) => ({ isSound: !state.isSound })),

      setPayAmount: (amount: number) => {
        set({ payAmount: amount })
        get().calculatePositionSize()
        get().calculatePotentialProfit()
      },

      setLeverage: (leverage: number) => {
        set({ leverage })
        get().calculatePositionSize()
        get().calculatePotentialProfit()
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
