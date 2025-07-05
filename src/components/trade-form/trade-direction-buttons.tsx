'use client'

import { simulateContract } from '@wagmi/core'
import { useCallback } from 'react'
import { parseUnits, zeroAddress, zeroHash } from 'viem'
import { arbitrum } from 'viem/chains'
import { useWriteContract } from 'wagmi'
import { config } from '@/components/providers/providers'
import { Button } from '@/components/ui/button'
import { useExecutionFee } from '@/hooks/use-execution-fee'
import { usePrice } from '@/hooks/use-price'
import { POSITION_ROUTER_ABI } from '@/lib/abis/position-router'
import { LINK, USDC } from '@/lib/constant'
import { getContract } from '@/lib/contracts'
import { useOBStore } from '@/store/store'

export const TradeDirectionButtons = () => {
  const payAmount = useOBStore.use.payAmount()
  const leverage = useOBStore.use.leverage()

  const { writeContractAsync } = useWriteContract()
  const { minExecutionFee } = useExecutionFee()
  const { numPrice, longPriceWithSlippage, shortPriceWithSlippage } = usePrice()

  const onOpenPosition = useCallback(
    async (isLong: boolean) => {
      const contract = getContract(arbitrum.id, 'PositionRouter')

      const args = isLong
        ? [
            [USDC.address, LINK.address], // _path
            LINK.address, // _indexToken
            parseUnits(String(payAmount), USDC.decimal), // _amountIn
            BigInt(0), // _minOut
            parseUnits(
              String((payAmount / numPrice) * leverage * numPrice),
              30,
            ), // _sizeDelta amount * price
            true, //_isLong
            parseUnits(String(longPriceWithSlippage), 30), // _acceptablePrice
            minExecutionFee, // _executionFee
            zeroHash, // _referralCode
            zeroAddress, // _callbackTarget
          ]
        : [
            [USDC.address],
            LINK.address, // _indexToken
            parseUnits(String(payAmount), USDC.decimal), // _amountIn
            BigInt(0), // _minOut
            parseUnits(
              String((payAmount / numPrice) * leverage * numPrice),
              30,
            ), // _sizeDelta amount * price
            false, //_isLong
            parseUnits(String(shortPriceWithSlippage), 30), // _acceptablePrice
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
    },
    [
      payAmount,
      leverage,
      numPrice,
      longPriceWithSlippage,
      shortPriceWithSlippage,
      minExecutionFee,
      writeContractAsync,
    ],
  )

  return (
    <div className="flex gap-4">
      <Button
        onClick={() => onOpenPosition(true)}
        className="flex-1 h-14 text-lg font-bold bg-[rgba(61,213,152,1)] hover:bg-[rgba(61,213,152,0.8)] text-white border-none shadow-lg hover:shadow-[rgba(61,213,152,0.25)] transition-all duration-200 hover:scale-105 active:scale-95"
      >
        Up
      </Button>

      <Button
        onClick={() => onOpenPosition(false)}
        className="flex-1 h-14 text-lg font-bold bg-[rgba(246,94,93,1)] hover:bg-[rgba(246,94,93,0.8)] text-white border-none shadow-lg hover:shadow-[rgba(246,94,93,0.25)] transition-all duration-200 hover:scale-105 active:scale-95"
      >
        Down
      </Button>
    </div>
  )
}
