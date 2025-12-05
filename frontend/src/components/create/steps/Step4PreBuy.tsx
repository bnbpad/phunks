import React, { useState, useEffect } from 'react'
import { CreditCard, TrendingUp, AlertTriangle, Calculator } from 'lucide-react'
import { ICreateToken } from '../../../lib/types/fourMeme'

interface Step4PreBuyProps {
  data: ICreateToken
  onDataChange: (updates: Partial<ICreateToken>) => void
  walletConnected: boolean
  walletBalance?: string
}

const Step4PreBuy: React.FC<Step4PreBuyProps> = ({
  data,
  onDataChange,
  walletConnected,
  walletBalance
}) => {
  const [preBuyAmount, setPreBuyAmount] = useState(data.tokenomics.amountToBuy || '0')
  const [preBuyEnabled, setPreBuyEnabled] = useState(parseFloat(data.tokenomics.amountToBuy || '0') > 0)

  useEffect(() => {
    onDataChange({
      tokenomics: {
        ...data.tokenomics,
        amountToBuy: preBuyEnabled ? preBuyAmount : '0'
      }
    })
  }, [preBuyAmount, preBuyEnabled, onDataChange, data.tokenomics])

  const handleTogglePreBuy = (enabled: boolean) => {
    setPreBuyEnabled(enabled)
    if (!enabled) {
      setPreBuyAmount('0')
    } else {
      setPreBuyAmount('0.1') // Default to 0.1 BNB
    }
  }

  const handleAmountChange = (value: string) => {
    // Validate numeric input
    if (/^\d*\.?\d*$/.test(value) || value === '') {
      setPreBuyAmount(value)
    }
  }

  const getBalanceNumber = (): number => {
    return parseFloat(walletBalance || '0')
  }

  const getPreBuyNumber = (): number => {
    return parseFloat(preBuyAmount || '0')
  }

  const hasInsufficientBalance = (): boolean => {
    if (!walletConnected) return false
    const balance = getBalanceNumber()
    const preBuy = getPreBuyNumber()
    const creationFee = 0.01 // 0.01 BNB creation fee
    return balance < (preBuy + creationFee)
  }

  const getTokensEstimate = (): number => {
    if (!preBuyEnabled || getPreBuyNumber() === 0) return 0

    // Simplified calculation based on Four.Meme tokenomics
    // 1B total supply, 24 BNB total raise, 80% sale rate
    const totalSupply = 1000000000 // 1B tokens
    const totalRaise = 24 // 24 BNB
    const saleRate = 0.8 // 80%
    const availableTokens = totalSupply * saleRate
    const preBuyBnb = getPreBuyNumber()

    // Tokens per BNB = availableTokens / totalRaise
    const tokensPerBnb = availableTokens / totalRaise
    return preBuyBnb * tokensPerBnb
  }

  const preBuyPresets = [
    { amount: '0.1', label: '0.1 BNB', description: '~33M tokens' },
    { amount: '0.5', label: '0.5 BNB', description: '~167M tokens' },
    { amount: '1.0', label: '1.0 BNB', description: '~333M tokens' },
    { amount: '2.0', label: '2.0 BNB', description: '~667M tokens' },
  ]

  return (
    <div className="space-y-6">
      {/* Pre-buy Toggle */}
      <div className="flex items-center justify-center">
        <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
          <span className="font-exo font-medium text-gray-700">Enable Pre-buy</span>
          <button
            onClick={() => handleTogglePreBuy(!preBuyEnabled)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              preBuyEnabled ? 'bg-bsc-500' : 'bg-gray-300'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                preBuyEnabled ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>

      {preBuyEnabled && (
        <>
          {/* Wallet Balance Check */}
          {walletConnected && (
            <div className={`p-4 rounded-lg border ${
              hasInsufficientBalance()
                ? 'bg-red-50 border-red-200 text-red-700'
                : 'bg-green-50 border-green-200 text-green-700'
            }`}>
              <div className="flex items-center gap-2 font-exo">
                <CreditCard className="w-5 h-5" />
                <span>
                  Wallet Balance: <strong>{getBalanceNumber().toFixed(4)} BNB</strong>
                </span>
                {hasInsufficientBalance() && (
                  <span className="text-red-600 ml-2">(Insufficient for pre-buy + fees)</span>
                )}
              </div>
            </div>
          )}

          {/* Amount Input */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-exo font-medium text-gray-700 mb-3">
                Pre-buy Amount (BNB)
              </label>

              <div className="relative">
                <input
                  type="text"
                  value={preBuyAmount}
                  onChange={(e) => handleAmountChange(e.target.value)}
                  placeholder="0.0"
                  className={`w-full px-4 py-4 text-xl font-mono bg-white border rounded-lg focus:outline-none transition-all ${
                    hasInsufficientBalance()
                      ? 'border-red-500 focus:border-red-500'
                      : 'border-gray-300 focus:border-bsc-500'
                  }`}
                />
                <div className="absolute right-4 top-4 text-xl font-exo font-medium text-gray-500">
                  BNB
                </div>
              </div>
            </div>

            {/* Quick Amount Presets */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {preBuyPresets.map((preset) => (
                <button
                  key={preset.amount}
                  onClick={() => setPreBuyAmount(preset.amount)}
                  className={`p-3 rounded-lg border-2 text-center transition-all ${
                    preBuyAmount === preset.amount
                      ? 'bg-bsc-50 border-bsc-500 text-bsc-700'
                      : 'bg-white border-gray-200 hover:border-bsc-300 text-gray-700'
                  }`}
                >
                  <div className="font-exo font-semibold">{preset.label}</div>
                  <div className="text-xs text-gray-500 font-exo">{preset.description}</div>
                </button>
              ))}
            </div>

            {/* Calculation Display */}
            {getPreBuyNumber() > 0 && (
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <h4 className="flex items-center gap-2 font-exo font-semibold text-blue-900 mb-3">
                  <Calculator className="w-5 h-5" />
                  Pre-buy Calculation
                </h4>

                <div className="space-y-2 text-sm font-exo">
                  <div className="flex justify-between">
                    <span className="text-gray-600">BNB Amount:</span>
                    <span className="font-semibold text-gray-900">{getPreBuyNumber().toFixed(4)} BNB</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Estimated Tokens:</span>
                    <span className="font-semibold text-gray-900">
                      {getTokensEstimate().toLocaleString()} {data.basicDetails.symbol || 'TOKENS'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">% of Total Supply:</span>
                    <span className="font-semibold text-gray-900">
                      {((getTokensEstimate() / 1000000000) * 100).toFixed(2)}%
                    </span>
                  </div>
                  <div className="border-t border-blue-200 pt-2 mt-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Creation Fee:</span>
                      <span className="font-semibold text-gray-900">0.01 BNB</span>
                    </div>
                    <div className="flex justify-between font-semibold">
                      <span className="text-gray-900">Total Cost:</span>
                      <span className="text-blue-700">{(getPreBuyNumber() + 0.01).toFixed(4)} BNB</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </>
      )}

      {/* Four.Meme Tokenomics Info */}
      <div className="bg-purple-50 rounded-lg p-6 border border-purple-200">
        <h4 className="font-orbitron font-bold text-gray-900 mb-4">
          📊 Four.Meme Tokenomics
        </h4>
        <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-700 font-exo">
          <div className="space-y-2">
            <p>• <strong>Total Supply:</strong> 1,000,000,000 tokens</p>
            <p>• <strong>Total Raise:</strong> 24 BNB pool</p>
            <p>• <strong>Sale Rate:</strong> 80% available for trading</p>
          </div>
          <div className="space-y-2">
            <p>• <strong>Trading Fee:</strong> 0.25% per transaction</p>
            <p>• <strong>Liquidity:</strong> Added automatically at launch</p>
            <p>• <strong>Trading:</strong> Starts immediately after creation</p>
          </div>
        </div>
      </div>

      {/* Benefits of Pre-buying */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6 border border-green-200">
        <h4 className="font-orbitron font-bold text-gray-900 mb-3">
          🚀 Pre-buy Benefits
        </h4>
        <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-700 font-exo">
          <div className="space-y-2">
            <p>• <strong>Early Position:</strong> Get tokens at launch price</p>
            <p>• <strong>No Slippage:</strong> Avoid price impact from manual buying</p>
          </div>
          <div className="space-y-2">
            <p>• <strong>Instant Execution:</strong> Tokens added to wallet immediately</p>
            <p>• <strong>Optimal Timing:</strong> Purchase right at token creation</p>
          </div>
        </div>
      </div>

      {/* Warning for insufficient balance */}
      {hasInsufficientBalance() && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-2 text-red-700">
            <AlertTriangle className="w-5 h-5" />
            <span className="font-exo font-medium">
              Insufficient BNB balance. You need at least {(getPreBuyNumber() + 0.01).toFixed(4)} BNB total.
            </span>
          </div>
        </div>
      )}
    </div>
  )
}

export default Step4PreBuy