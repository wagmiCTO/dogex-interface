'use client'

import { useQuery } from '@tanstack/react-query'
import { simulateContract } from '@wagmi/core'
import { useMemo } from 'react'
import { formatUnits, parseUnits, zeroAddress, zeroHash } from 'viem'
import { arbitrum } from 'viem/chains'
import { useWriteContract } from 'wagmi'
import { getPrices } from '@/api/gmx-api'
import { config } from '@/components/providers/providers'
import { Button } from '@/components/ui/button'
import { useExecutionFee } from '@/hooks/use-execution-fee'
import { usePrice } from '@/hooks/use-price'
import { POSITION_ROUTER_ABI } from '@/lib/abis/position-router'
import { ALLOWED_SLIPPAGE, LINK, USDC } from '@/lib/constant'
import { getContract } from '@/lib/contracts'
import { useOBStore } from '@/store/store'

export const TradeDirectionButtons = () => {
  const openShortPosition = useOBStore.use.openShortPosition()

  const payAmount = useOBStore.use.payAmount()
  const leverage = useOBStore.use.leverage()

  const { writeContractAsync } = useWriteContract()
  const { minExecutionFee } = useExecutionFee()
  const { numPrice, priceWithSlippage } = usePrice()

  const openLongPosition = async () => {
    const contract = getContract(arbitrum.id, 'PositionRouter')

    const args = [
      [USDC.address, LINK.address], // _path
      LINK.address, // _indexToken
      parseUnits(String(payAmount), USDC.decimal), // _amountIn
      BigInt(0), // _minOut
      parseUnits(String((payAmount / numPrice) * leverage * numPrice), 30), // _sizeDelta amount * price
      true, //_isLong
      parseUnits(String(priceWithSlippage), 30), // _acceptablePrice
      minExecutionFee, // _executionFee
      zeroHash, // _referralCode
      zeroAddress, // _callbackTarget
    ]

    try {
      const simulation = await simulateContract(config, {
        abi: POSITION_ROUTER_ABI,
        address: contract,
        functionName: 'createIncreasePosition',
        args,
        chainId: arbitrum.id,
        value: minExecutionFee,
      })
      console.log('Simulation result:', simulation)
      // If simulation is successful, send the real tx
      await writeContractAsync({
        abi: POSITION_ROUTER_ABI,
        address: contract,
        functionName: 'createIncreasePosition',
        args,
        value: minExecutionFee,
      })
    } catch (error) {
      console.log({ error })
    }
  }

  return (
    <div className="flex gap-4">
      <Button
        onClick={openLongPosition}
        className="flex-1 h-14 text-lg font-bold bg-[rgba(61,213,152,1)] hover:bg-[rgba(61,213,152,0.8)] text-white border-none shadow-lg hover:shadow-[rgba(61,213,152,0.25)] transition-all duration-200 hover:scale-105 active:scale-95"
      >
        Up
      </Button>

      <Button
        onClick={openShortPosition}
        className="flex-1 h-14 text-lg font-bold bg-[rgba(246,94,93,1)] hover:bg-[rgba(246,94,93,0.8)] text-white border-none shadow-lg hover:shadow-[rgba(246,94,93,0.25)] transition-all duration-200 hover:scale-105 active:scale-95"
      >
        Down
      </Button>
    </div>
  )
}
