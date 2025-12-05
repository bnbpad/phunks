import { useSwitchChain } from 'wagmi'
import { bsc } from 'wagmi/chains'
import { useCallback } from 'react'

export function useNetworkSwitch() {
  const { switchChain } = useSwitchChain()

  const switchToBSC = useCallback(async () => {
    try {
      await switchChain({ chainId: bsc.id })
      return { success: true }
    } catch (error) {
      console.error('Failed to switch to BSC:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to switch network'
      }
    }
  }, [switchChain])

  return {
    switchToBSC,
    bscChainId: bsc.id,
  }
}