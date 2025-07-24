import { createSelectors } from '@/store/create-selectors'
import { create } from 'zustand'

interface OBState {
  isSound: boolean
  payAmount: number
  leverage: number
  positionSize: number
  potentialProfit: { min: number; max: number }
  liquidationPrice: number
  hasActivePosition: boolean
}

type OBAction = {
  toggleSound: () => void
  setPayAmount: (amount: number) => void
  setLeverage: (leverage: number) => void
  calculatePositionSize: () => void
  calculatePotentialProfit: () => void
  calculateLiquidationPrice: () => void
  setHasActivePosition: (hasPosition: boolean) => void
}

export const useStore = create<OBState & OBAction>(
  (set, get) =>
    ({
      isSound: true,
      payAmount: 10,
      leverage: 10,
      positionSize: 200,
      potentialProfit: { min: 10, max: 20 },
      liquidationPrice: 0,
      hasActivePosition: false,

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

      setHasActivePosition: (hasPosition: boolean) => {
        set({ hasActivePosition: hasPosition })
      },
    }) as const,
)

export const useOBStore = createSelectors(useStore)
