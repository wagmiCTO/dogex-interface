'use client'

import { simulateContract } from '@wagmi/core'
import { zeroAddress, zeroHash } from 'viem'
import { arbitrum } from 'viem/chains'
import { useWriteContract } from 'wagmi'
import { config } from '@/components/providers/providers'
import { Button } from '@/components/ui/button'
import { POSITION_ROUTER_ABI } from '@/lib/abis/position-router'
import { getContract } from '@/lib/contracts'
import { useOBStore } from '@/store/store'

export const TradeDirectionButtons = () => {
  const openShortPosition = useOBStore.use.openShortPosition()

  const payAmount = useOBStore.use.payAmount()
  const leverage = useOBStore.use.leverage()

  const { writeContractAsync } = useWriteContract()

  const openLongPosition = async () => {
    console.log({ payAmount, leverage })
    const contract = getContract(arbitrum.id, 'PositionRouter')

    const executionFee = BigInt('210807500000000')

    const args = [
      [
        '0xaf88d065e77c8cC2239327C5EDb3A432268e5831',
        '0xf97f4df75117a78c1A5a0DBb814Af92458539FB4',
      ], // _path
      '0xf97f4df75117a78c1A5a0DBb814Af92458539FB4', // _indexToken
      BigInt('10000000'), // _amountIn
      BigInt(0), // _minOut
      BigInt('19920159680638722547850000000000'), // _sizeDelta
      true, //_isLong
      BigInt('13988500000000000000000000000000'), // _acceptablePrice
      executionFee, // _executionFee
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
        value: BigInt('210807500000000'),
      })
      console.log('Simulation result:', simulation)
      // If simulation is successful, send the real tx
      await writeContractAsync({
        abi: POSITION_ROUTER_ABI,
        address: contract,
        functionName: 'createIncreasePosition',
        args,
        value: executionFee,
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
