'use client'

import { Button } from '@/components/ui/button'
import { usdcAbi } from '@/lib/abis/usdc'
import { useEffect, useState } from 'react'
import { formatUnits, parseUnits } from 'viem'
import {
  useAccount,
  useReadContract,
  useWaitForTransactionReceipt,
  useWriteContract,
} from 'wagmi'

const USDC_CONTRACT_ADDRESS = '0x7e8aD9892265a5A665062b5C3D387aF301A673b6'
const MINT_AMOUNT = 1000

export default function MintComponent() {
  const { address, isConnected } = useAccount()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const { data: balance, refetch: refetchBalance } = useReadContract({
    address: USDC_CONTRACT_ADDRESS,
    abi: usdcAbi,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  })

  console.log({ balance })

  const { data: decimals } = useReadContract({
    address: USDC_CONTRACT_ADDRESS,
    abi: usdcAbi,
    functionName: 'decimals',
  })

  const { writeContract, data: hash, isPending } = useWriteContract()

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    })

  useEffect(() => {
    if (isConfirmed) {
      setSuccess('Successfully minted 1000 USDC!')
      setIsLoading(false)
      refetchBalance()
      setTimeout(() => setSuccess(null), 5000)
    }
  }, [isConfirmed, refetchBalance])

  const handleMint = async () => {
    if (!address || !isConnected) {
      setError('Please connect your wallet')
      return
    }

    setError(null)
    setSuccess(null)
    setIsLoading(true)

    try {
      if (balance && decimals) {
        const balanceInUsdc = Number(formatUnits(balance, decimals))
        if (balanceInUsdc > 100) {
          setError('You cannot mint USDC if you have more than 100 USDC')
          setIsLoading(false)
          return
        }
      }

      const amount = parseUnits(MINT_AMOUNT.toString(), decimals || 6)

      writeContract({
        address: USDC_CONTRACT_ADDRESS,
        abi: usdcAbi,
        functionName: 'mint',
        args: [address, amount],
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to mint USDC')
      setIsLoading(false)
    }
  }

  const formatBalance = (
    balance: bigint | undefined,
    decimals: number | undefined,
  ) => {
    if (!balance || !decimals) return '0'
    return Number(formatUnits(balance, decimals)).toFixed(2)
  }

  const canMint = () => {
    if (!balance || !decimals) return true
    const balanceInUsdc = Number(formatUnits(balance, decimals))
    return balanceInUsdc <= 100
  }

  return (
    <div className="w-full max-w-md mx-auto bg-gray-800 rounded-lg p-6 shadow-lg">
      <h2 className="text-2xl font-bold text-white mb-6 text-center">
        Mint USDC
      </h2>

      <div className="mb-6 p-4 bg-gray-700 rounded-lg">
        <div className="text-sm text-gray-300 mb-1">Current USDC Balance</div>
        <div className="text-xl font-semibold text-white">
          {isConnected ? formatBalance(balance, decimals) : '0.00'} USDC
        </div>
      </div>

      <div className="mb-6 p-4 bg-gray-700 rounded-lg">
        <div className="text-sm text-gray-300 mb-1">Mint Amount</div>
        <div className="text-xl font-semibold text-green-400">1,000 USDC</div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-900/50 border border-red-500 rounded-lg">
          <p className="text-red-200 text-sm">{error}</p>
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 bg-green-900/50 border border-green-500 rounded-lg">
          <p className="text-green-200 text-sm">{success}</p>
        </div>
      )}

      <Button
        onClick={handleMint}
        disabled={
          !isConnected || !canMint() || isLoading || isPending || isConfirming
        }
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition-colors"
      >
        {!isConnected
          ? 'Connect Wallet'
          : !canMint()
            ? 'Cannot mint (Balance > 100 USDC)'
            : isLoading || isPending
              ? 'Minting...'
              : isConfirming
                ? 'Confirming...'
                : 'Mint 1,000 USDC'}
      </Button>

      {hash && (
        <div className="mt-4 p-3 bg-gray-700 rounded-lg">
          <div className="text-sm text-gray-300 mb-1">Transaction Hash</div>
          <div className="text-xs text-blue-400 break-all">{hash}</div>
        </div>
      )}

      <div className="mt-6 text-xs text-gray-400 text-center">
        <p>• You can only mint if your balance is 100 USDC or less</p>
        <p>• Each mint gives you 1,000 USDC</p>
      </div>
    </div>
  )
}
