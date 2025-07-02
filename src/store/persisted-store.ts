import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { createSelectors } from '@/store/create-selectors'

interface ObPersistedState {
  isSound: boolean
}

interface ObPersistedActions {
  toggleSound: () => void
}

export const useStore = create<ObPersistedState & ObPersistedActions>()(
  persist(
    (set, get) => ({
      isSound: true,

      toggleSound: () => set({ isSound: !get().isSound }),
    }),
    {
      name: 'ObPersistedStore',
    },
  ),
)

export const useOBPersistedStore = createSelectors(useStore)
