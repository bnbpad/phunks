import React from 'react'
import { Receipt, CreditCard, CheckCircle, AlertTriangle, ExternalLink } from 'lucide-react'
import { ICreateToken } from '../../../lib/types/fourMeme'

interface Step5FeeVerificationProps {
  data: ICreateToken
  onDataChange: (updates: Partial<ICreateToken>) => void
  walletConnected: boolean
  walletBalance?: string
}

const Step5FeeVerification: React.FC<Step5FeeVerificationProps> = ({
  data,
  onDataChange,
  walletConnected,
  walletBalance
}) => {
  const getBalanceNumber = (): number => {
    return parseFloat(walletBalance || '0')
  }

  const getPreBuyAmount = (): number => {
    return parseFloat(data.tokenomics.amountToBuy || '0')
  }

  const creationFee = 0.01 // 0.01 BNB
  const preBuyAmount = getPreBuyAmount()
  const totalCost = creationFee + preBuyAmount
  const userBalance = getBalanceNumber()
  const remainingBalance = userBalance - totalCost

  const hasInsufficientBalance = totalCost > userBalance
  const isBalanceLow = remainingBalance < 0.01 && !hasInsufficientBalance

  const feeBreakdown = [
    {
      label: 'Token Creation Fee',
      amount: creationFee,
      description: 'Fixed fee for deploying token on Four.Meme',
      mandatory: true
    },
    {
      label: 'Pre-buy Amount',
      amount: preBuyAmount,
      description: 'Optional token purchase during creation',
      mandatory: false
    }
  ]

  const networkInfo = [
    {
      label: 'Network',
      value: 'BNB Smart Chain (BSC)',
      icon: '🟡'
    },
    {
      label: 'Gas Fees',
      value: 'Included in creation fee',
      icon: '⛽'
    },
    {
      label: 'Block Time',
      value: '~3 seconds',
      icon: '⚡'
    },
    {
      label: 'Confirmation',
      value: 'Instant on BSC',
      icon: '✅'
    }
  ]

  return (
    <div className="space-y-6">
      {/* Wallet Status */}
      <div className={`p-4 rounded-lg border ${
        !walletConnected
          ? 'bg-red-50 border-red-200'
          : hasInsufficientBalance
          ? 'bg-red-50 border-red-200'
          : isBalanceLow
          ? 'bg-yellow-50 border-yellow-200'
          : 'bg-green-50 border-green-200'
      }`}>
        <div className="flex items-center gap-3">
          {!walletConnected ? (
            <>
              <AlertTriangle className="w-6 h-6 text-red-600" />
              <div>
                <p className="font-exo font-semibold text-red-800">Wallet Not Connected</p>
                <p className="text-sm text-red-700 font-exo">Please connect your wallet to continue</p>
              </div>
            </>
          ) : hasInsufficientBalance ? (
            <>
              <AlertTriangle className="w-6 h-6 text-red-600" />
              <div>
                <p className="font-exo font-semibold text-red-800">Insufficient Balance</p>
                <p className="text-sm text-red-700 font-exo">
                  You need {totalCost.toFixed(4)} BNB but have {userBalance.toFixed(4)} BNB
                </p>
              </div>
            </>
          ) : isBalanceLow ? (
            <>
              <AlertTriangle className="w-6 h-6 text-yellow-600" />
              <div>
                <p className="font-exo font-semibold text-yellow-800">Low Balance Warning</p>
                <p className="text-sm text-yellow-700 font-exo">
                  You'll have {remainingBalance.toFixed(4)} BNB remaining after token creation
                </p>
              </div>
            </>
          ) : (
            <>
              <CheckCircle className="w-6 h-6 text-green-600" />
              <div>
                <p className="font-exo font-semibold text-green-800">Sufficient Balance</p>
                <p className="text-sm text-green-700 font-exo">
                  You'll have {remainingBalance.toFixed(4)} BNB remaining after token creation
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Fee Breakdown */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="p-4 bg-gray-50 border-b border-gray-200">
          <h3 className="flex items-center gap-2 font-orbitron font-bold text-gray-900">
            <Receipt className="w-5 h-5" />
            Cost Breakdown
          </h3>
        </div>

        <div className="p-4 space-y-4">
          {feeBreakdown.map((fee, index) => (
            <div key={index} className="flex items-center justify-between py-2">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-exo font-medium text-gray-900">{fee.label}</span>
                  {fee.mandatory && (
                    <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded font-exo">
                      Required
                    </span>
                  )}
                  {!fee.mandatory && fee.amount > 0 && (
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded font-exo">
                      Optional
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600 font-exo">{fee.description}</p>
              </div>
              <div className="text-right">
                <div className="font-mono font-semibold text-gray-900">
                  {fee.amount.toFixed(4)} BNB
                </div>
                {fee.amount > 0 && (
                  <div className="text-xs text-gray-500 font-exo">
                    ~${(fee.amount * 600).toFixed(2)} USD
                  </div>
                )}
              </div>
            </div>
          ))}

          <hr className="border-gray-200" />

          <div className="flex items-center justify-between py-2">
            <div className="flex-1">
              <span className="font-orbitron font-bold text-gray-900 text-lg">Total Cost</span>
            </div>
            <div className="text-right">
              <div className="font-mono font-bold text-xl text-bsc-600">
                {totalCost.toFixed(4)} BNB
              </div>
              <div className="text-sm text-gray-500 font-exo">
                ~${(totalCost * 600).toFixed(2)} USD
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Balance Summary */}
      {walletConnected && (
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-exo font-semibold text-gray-900 mb-3">Wallet Summary</h4>
          <div className="space-y-2 text-sm font-exo">
            <div className="flex justify-between">
              <span className="text-gray-600">Current Balance:</span>
              <span className="font-mono font-semibold text-gray-900">{userBalance.toFixed(4)} BNB</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Total Cost:</span>
              <span className="font-mono font-semibold text-gray-900">-{totalCost.toFixed(4)} BNB</span>
            </div>
            <hr className="border-gray-300" />
            <div className="flex justify-between">
              <span className="font-semibold text-gray-900">Remaining Balance:</span>
              <span className={`font-mono font-bold ${
                remainingBalance < 0 ? 'text-red-600' : remainingBalance < 0.01 ? 'text-yellow-600' : 'text-green-600'
              }`}>
                {remainingBalance.toFixed(4)} BNB
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Network Information */}
      <div className="bg-bsc-50 rounded-lg p-6 border border-bsc-200">
        <h4 className="font-orbitron font-bold text-gray-900 mb-4">
          ⚡ BNB Smart Chain Information
        </h4>
        <div className="grid md:grid-cols-2 gap-4">
          {networkInfo.map((info, index) => (
            <div key={index} className="flex items-center gap-3">
              <span className="text-lg">{info.icon}</span>
              <div>
                <span className="font-exo font-medium text-gray-900">{info.label}:</span>
                <span className="ml-2 text-gray-700 font-exo">{info.value}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* What Happens Next */}
      <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
        <h4 className="font-orbitron font-bold text-gray-900 mb-4">
          🚀 What Happens Next
        </h4>
        <div className="space-y-3 text-sm text-gray-700 font-exo">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">1</div>
            <p><strong>Transaction Signing:</strong> You'll be prompted to sign the transaction in your wallet</p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">2</div>
            <p><strong>Token Creation:</strong> Your token will be deployed on Four.Meme platform</p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">3</div>
            <p><strong>Liquidity Addition:</strong> Trading liquidity will be automatically added</p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">4</div>
            <p><strong>Live Trading:</strong> Your token will be immediately tradeable on Four.Meme</p>
          </div>
        </div>
      </div>

      {/* External Links */}
      <div className="text-center space-y-2">
        <p className="text-sm text-gray-600 font-exo">
          Learn more about Four.Meme platform
        </p>
        <div className="flex items-center justify-center gap-4">
          <a
            href="https://four.meme"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm font-exo transition-colors"
          >
            Four.Meme Platform
            <ExternalLink className="w-3 h-3" />
          </a>
          <a
            href="https://bscscan.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm font-exo transition-colors"
          >
            BSCScan Explorer
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  )
}

export default Step5FeeVerification