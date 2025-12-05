import React, { useState } from 'react'
import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { Wallet, ChevronDown, Copy, ExternalLink } from 'lucide-react'
import config from '../lib/config'

export function ConnectWallet() {
  const { address, isConnected } = useAccount()
  const { connect, connectors, isPending } = useConnect()
  const { disconnect } = useDisconnect()
  const [isConnecting, setIsConnecting] = useState(false)
  const [showConnectors, setShowConnectors] = useState(false)

  const handleConnect = async (connector: any) => {
    try {
      setIsConnecting(true)
      await connect({ connector })
      setShowConnectors(false)
    } catch (error) {
      console.error('Failed to connect wallet:', error)
    } finally {
      setIsConnecting(false)
    }
  }

  const handleDisconnect = () => {
    disconnect()
    setShowConnectors(false)
  }

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address)
    }
  }

  const openExplorer = () => {
    if (address) {
      window.open(`${config.network.blockExplorer}/address/${address}`, '_blank')
    }
  }

  if (isConnected && address) {
    return (
      <div className="relative">
        <button
          onClick={() => setShowConnectors(!showConnectors)}
          className="flex items-center gap-3 bg-white card-shadow rounded-lg px-4 py-2 hover:shadow-lg transition-all"
        >
          <div className="w-8 h-8 bg-bsc-500 rounded-full flex items-center justify-center">
            <Wallet className="w-4 h-4 text-white" />
          </div>
          <div className="text-left">
            <div className="text-sm font-exo font-medium text-gray-900">Connected</div>
            <div className="text-xs font-mono text-gray-600">{formatAddress(address)}</div>
          </div>
          <ChevronDown className={`w-4 h-4 text-gray-600 transition-transform ${showConnectors ? 'rotate-180' : ''}`} />
        </button>

        {showConnectors && (
          <div className="absolute top-full left-0 mt-2 w-64 bg-white card-shadow rounded-lg border border-gray-200 z-50">
            <div className="p-4">
              <div className="text-sm font-exo font-medium text-gray-900 mb-3">Wallet Actions</div>
              <div className="space-y-2">
                <button
                  onClick={copyAddress}
                  className="flex items-center gap-2 w-full text-left px-3 py-2 text-sm font-exo text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <Copy className="w-4 h-4" />
                  Copy Address
                </button>
                <button
                  onClick={openExplorer}
                  className="flex items-center gap-2 w-full text-left px-3 py-2 text-sm font-exo text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  View on BSCScan
                </button>
                <hr className="my-2 border-gray-200" />
                <button
                  onClick={handleDisconnect}
                  className="flex items-center gap-2 w-full text-left px-3 py-2 text-sm font-exo text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Wallet className="w-4 h-4" />
                  Disconnect
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="relative">
      <button
        onClick={() => setShowConnectors(!showConnectors)}
        disabled={isPending || isConnecting}
        className="flex items-center gap-2 px-6 py-3 bsc-gradient hover:opacity-90 rounded-lg font-exo font-medium text-white transition-opacity disabled:opacity-50"
      >
        <Wallet className="w-5 h-5" />
        {isConnecting ? 'Connecting...' : 'Connect Wallet'}
      </button>

      {showConnectors && (
        <div className="absolute top-full left-0 mt-2 w-72 bg-white card-shadow rounded-lg border border-gray-200 z-50">
          <div className="p-4">
            <div className="text-center mb-4">
              <h3 className="text-lg font-orbitron font-bold text-gray-900 mb-2">Connect Wallet</h3>
              <p className="text-gray-600 text-sm font-exo">
                Choose a wallet to connect and start creating agents
              </p>
            </div>

            <div className="space-y-3">
              {connectors.map((connector) => (
                <button
                  key={connector.id}
                  onClick={() => handleConnect(connector)}
                  disabled={isPending || isConnecting}
                  className="w-full flex items-center gap-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="w-8 h-8 bg-bsc-500 rounded-full flex items-center justify-center">
                    <Wallet className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-exo font-medium text-gray-900">
                    {connector.name}
                  </span>
                </button>
              ))}
            </div>

            <div className="mt-4 p-3 bg-bsc-50 rounded-lg border border-bsc-200">
              <div className="flex items-center gap-2 text-xs text-bsc-600">
                <div className="w-3 h-3 bg-bsc-500 diamond-shape"></div>
                <span className="font-exo">This app works on BNB Smart Chain (BSC)</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}