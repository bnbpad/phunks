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
      refetchInterval: 5000, // Refetch every 5 seconds
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
    // Manual formatting if Wagmi formatting fails
    const formatBalance = (balance: any) => {
      if (!balance || !balance.value) return '0'
      if (balance.formatted) return balance.formatted

      // Manual conversion: value is in wei (18 decimals for BNB)
      const valueStr = balance.value.toString()
      const decimals = balance.decimals || 18

      if (valueStr.length <= decimals) {
        return '0.' + '0'.repeat(decimals - valueStr.length) + valueStr
      } else {
        const integerPart = valueStr.slice(0, -decimals)
        const decimalPart = valueStr.slice(-decimals)
        return integerPart + '.' + decimalPart
      }
    }

    const formattedBnb = formatBalance(bnbBalance)
    const formattedUsdt = formatBalance(usdtBalance)

    // Balance updated successfully

    setBalances({
      bnb: formattedBnb,
      usdt: formattedUsdt,
    })
  }, [bnbBalance, usdtBalance, address, isConnected])

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

  // Force balance refresh when wallet connects
  useEffect(() => {
    if (isConnected && address) {
      console.log('Wallet connected, forcing balance refresh...')
      setTimeout(() => {
        refreshBalance()
      }, 1000) // Wait 1 second then refresh
    }
  }, [isConnected, address, refreshBalance])

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