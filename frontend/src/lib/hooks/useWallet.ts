import { useAccount, useBalance, useChainId } from 'wagmi'
import { useState, useEffect, useCallback } from 'react'
import { bsc } from 'wagmi/chains'
import config from '../config'

export interface WalletState {
  isConnected: boolean
  address: string | undefined
  chainId: number | undefined
  isCorrectNetwork: boolean
  balance: {
    bnb: string
    usdt: string
  }
}

export interface WalletActions {
  refreshBalance: () => Promise<void>
  checkNetwork: () => boolean
}

export function useWallet(): [WalletState, WalletActions] {
  const { address, isConnected } = useAccount()
  const chainId = useChainId()
  const [balances, setBalances] = useState({
    bnb: '0',
    usdt: '0'
  })

  // Get BNB balance
  const { data: bnbBalance, refetch: refetchBNB } = useBalance({
    address,
    query: {
      enabled: !!address && isConnected,
    },
  })

  // Get USDT balance
  const { data: usdtBalance, refetch: refetchUSDT } = useBalance({
    address,
    token: config.contracts.tokens.usdt as `0x${string}`,
    query: {
      enabled: !!address && isConnected,
    },
  })

  // Update balances when data changes
  useEffect(() => {
    setBalances({
      bnb: bnbBalance?.formatted || '0',
      usdt: usdtBalance?.formatted || '0',
    })
  }, [bnbBalance, usdtBalance])

  // Check if connected to correct network
  const isCorrectNetwork = chainId === bsc.id

  // Refresh all balances
  const refreshBalance = useCallback(async () => {
    if (!address || !isConnected) return

    try {
      await Promise.all([
        refetchBNB(),
        refetchUSDT(),
      ])
    } catch (error) {
      console.error('Failed to refresh balances:', error)
    }
  }, [address, isConnected, refetchBNB, refetchUSDT])

  // Check network
  const checkNetwork = useCallback(() => {
    return isCorrectNetwork
  }, [isCorrectNetwork])

  const state: WalletState = {
    isConnected,
    address,
    chainId,
    isCorrectNetwork,
    balance: balances,
  }

  const actions: WalletActions = {
    refreshBalance,
    checkNetwork,
  }

  return [state, actions]
}