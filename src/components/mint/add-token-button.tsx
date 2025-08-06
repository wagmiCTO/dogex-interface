'use client'

import WalletIcon from '@/components/ui/wallet-icon'
import { TOKENS } from '@/lib/constant'
import { useState } from 'react'
import { useAccount, useConnectorClient } from 'wagmi'

// Get USDC token info from constants
const USDC_TOKEN = TOKENS.find((token) => token.symbol === 'USDC')

interface AddTokenButtonProps {
  onSuccess?: (message: string) => void
  onError?: (message: string) => void
}

export default function AddTokenButton({
  onSuccess,
  onError,
}: AddTokenButtonProps) {
  const { isConnected } = useAccount()
  const { data: connectorClient } = useConnectorClient()
  const [isLoading, setIsLoading] = useState(false)

  const addTokenToWallet = async () => {
    if (!USDC_TOKEN) {
      onError?.('Token information not found')
      return
    }

    if (!connectorClient) {
      onError?.('Wallet not connected')
      return
    }

    setIsLoading(true)

    try {
      await connectorClient.request({
        method: 'wallet_watchAsset',
        params: {
          type: 'ERC20',
          options: {
            address: USDC_TOKEN.address,
            symbol: USDC_TOKEN.symbol,
            decimals: USDC_TOKEN.decimals,
            image: USDC_TOKEN.imageUrl,
          },
        },
      })

      onSuccess?.('USDC token added to wallet successfully!')
    } catch (error: any) {
      console.error('Error adding token to wallet:', error)
      if (error.code === 4001) {
        onError?.('Token addition cancelled by user')
      } else {
        onError?.('Failed to add token to wallet')
      }
    } finally {
      setIsLoading(false)
    }
  }

  if (!isConnected) return null

  return (
    <button
      onClick={addTokenToWallet}
      disabled={isLoading}
      className="relative group w-10 h-10 rounded-full   transition-all duration-300 ease-out flex items-center justify-center cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed backdrop-blur-sm"
      title="Add USDC to wallet"
    >
      {/* Glow effect */}
      <div className="absolute inset-0 rounded-full  opacity-0 group-hover:opacity-100 blur-md transition-opacity duration-300" />

      {/* Main icon container */}
      <div className="relative w-5 h-5 text-gray-100 group-hover:text-blue-200 transition-colors duration-200 group-hover:scale-110 transform transition-transform duration-200">
        {isLoading ? (
          <div className="w-5 h-5 border-2  border-t-transparent rounded-full animate-spin" />
        ) : (
          <WalletIcon />
        )}
      </div>
    </button>
  )
}
