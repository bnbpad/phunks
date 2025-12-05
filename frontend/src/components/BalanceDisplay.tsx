import React, { useState } from 'react'
import { useWallet } from '../lib/hooks/useWallet'
import { RefreshCw, AlertTriangle } from 'lucide-react'

export function BalanceDisplay() {
  const [walletState, walletActions] = useWallet()
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await walletActions.refreshBalance()
    setIsRefreshing(false)
  }

  if (!walletState.isConnected) {
    return null
  }

  return (
    <div className="bg-white card-shadow rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-2 h-8 bg-bsc-500 rounded-full"></div>
          <h3 className="text-xl font-orbitron font-bold text-gray-900">Wallet Balance</h3>
        </div>
        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="p-2 text-gray-400 hover:text-bsc-600 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {!walletState.isCorrectNetwork && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-600" />
            <span className="text-red-700 text-sm font-exo">
              Please switch to BNB Smart Chain (BSC)
            </span>
          </div>
        </div>
      )}

      <div className="space-y-4">
        <div className="bg-bsc-50 rounded-lg p-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <img src="/bsc.svg" alt="BNB" className="w-6 h-6" />
              <span className="font-exo font-medium text-gray-900">BNB</span>
            </div>
            <span className="text-lg font-orbitron font-bold text-gray-900">
              {Number(walletState.balance.bnb).toFixed(4)}
            </span>
          </div>
        </div>

        <div className="bg-green-50 rounded-lg p-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">$</span>
              </div>
              <span className="font-exo font-medium text-gray-900">USDT</span>
            </div>
            <span className="text-lg font-orbitron font-bold text-gray-900">
              {Number(walletState.balance.usdt).toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
        <div className="text-xs text-gray-500 font-exo text-center">
          Address: {walletState.address ? `${walletState.address.slice(0, 6)}...${walletState.address.slice(-4)}` : 'Not connected'}
        </div>
      </div>
    </div>
  )
}