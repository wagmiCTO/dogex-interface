import { zeroAddress } from 'viem'
import { useAccount, useReadContract } from 'wagmi'
import { POSITION_ROUTER_ABI } from '@/lib/abis/position-router'
import { getContract } from '@/lib/contracts'

export const useExecutionFee = () => {
  const { chainId } = useAccount()
  const contract = chainId
    ? getContract(chainId, 'PositionRouter')
    : zeroAddress

  const { data: minExecutionFee, isFetching } = useReadContract({
    address: contract,
    abi: POSITION_ROUTER_ABI,
    functionName: 'minExecutionFee',
    query: {
      enabled: !!chainId,
    },
  })

  return {
    minExecutionFee: minExecutionFee as bigint | undefined,
    isFetching,
  }
}
