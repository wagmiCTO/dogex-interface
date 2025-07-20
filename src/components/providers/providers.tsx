'use client'

import { getDefaultConfig } from '@rainbow-me/rainbowkit'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { sepolia } from 'viem/chains'
import { WagmiProvider } from 'wagmi'
import ObRainbowKitProvider from '@/components/providers/ob-rainbowkit-provider'

export const config = getDefaultConfig({
  appName: 'DogEx',
  projectId: '442a9cb141f0cc2019c88cce66649b02',
  chains: [sepolia],
  ssr: true,
})

const queryClient = new QueryClient()

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ObRainbowKitProvider>{children}</ObRainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}
