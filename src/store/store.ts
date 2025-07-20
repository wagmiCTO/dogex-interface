import { create } from 'zustand'
import { createSelectors } from '@/store/create-selectors'

interface OBState {
  isSound: boolean
  payAmount: number
  leverage: number
  positionSize: number
  potentialProfit: { min: number; max: number }
  liquidationPrice: number
}

type OBAction = {
  toggleSound: () => void
  setPayAmount: (amount: number) => void
  setLeverage: (leverage: number) => void
  calculatePositionSize: () => void
  calculatePotentialProfit: () => void
  calculateLiquidationPrice: () => void
  openLongPosition: () => void
  openShortPosition: () => void
}

export const useStore = create<OBState & OBAction>(
  (set, get) =>
    ({
      isSound: true,
      payAmount: 10,
      leverage: 2,
      positionSize: 20,
      potentialProfit: { min: 10, max: 20 },
      liquidationPrice: 0,

      toggleSound: () => set((state) => ({ isSound: !state.isSound })),

      setPayAmount: (amount: number) => {
        set({ payAmount: amount })
        get().calculatePositionSize()
        get().calculatePotentialProfit()
        get().calculateLiquidationPrice()
      },

      setLeverage: (leverage: number) => {
        set({ leverage })
        get().calculatePositionSize()
        get().calculatePotentialProfit()
        get().calculateLiquidationPrice()
      },

      calculatePositionSize: () => {
        const { payAmount, leverage } = get()
        const positionSize = payAmount * leverage
        set({ positionSize })
      },

      calculatePotentialProfit: () => {
        const { positionSize } = get()
        const min = Math.round(positionSize * 0.1)
        const max = Math.round(positionSize * 0.2)
        set({ potentialProfit: { min, max } })
      },

      calculateLiquidationPrice: () => {
        const { leverage } = get()
        const currentPrice = 0.21
        const liquidationDistance = currentPrice / leverage
        set({ liquidationPrice: currentPrice - liquidationDistance })
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
