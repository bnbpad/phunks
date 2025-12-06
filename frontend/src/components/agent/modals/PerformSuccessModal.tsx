import React from 'react'
import { X, CheckCircle, ExternalLink, Copy, Zap, BarChart3 } from 'lucide-react'

interface PerformSuccessModalProps {
  isOpen: boolean
  onClose: () => void
  agentName: string
  agentSymbol: string
  actionType: 'trade' | 'analysis' | 'optimization'
  actionDetails?: {
    pair?: string
    type?: 'Long' | 'Short'
    amount?: string
    price?: string
    expectedReturn?: string
  }
  txHash?: string
}

const PerformSuccessModal: React.FC<PerformSuccessModalProps> = ({
  isOpen,
  onClose,
  agentName,
  agentSymbol,
  actionType,
  actionDetails,
  txHash
}) => {
  const [copied, setCopied] = React.useState(false)

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const getActionTitle = () => {
    switch (actionType) {
      case 'trade':
        return 'Trade Executed Successfully!'
      case 'analysis':
        return 'Market Analysis Complete!'
      case 'optimization':
        return 'Strategy Optimization Complete!'
      default:
        return 'Action Completed Successfully!'
    }
  }

  const getActionIcon = () => {
    switch (actionType) {
      case 'trade':
        return <Zap className="w-8 h-8 text-green-600" />
      case 'analysis':
        return <BarChart3 className="w-8 h-8 text-blue-600" />
      case 'optimization':
        return <CheckCircle className="w-8 h-8 text-purple-600" />
      default:
        return <CheckCircle className="w-8 h-8 text-green-600" />
    }
  }

  const getActionColor = () => {
    switch (actionType) {
      case 'trade':
        return 'green'
      case 'analysis':
        return 'blue'
      case 'optimization':
        return 'purple'
      default:
        return 'green'
    }
  }

  if (!isOpen) return null

  const color = getActionColor()

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 bg-${color}-100 rounded-full flex items-center justify-center`}>
              {getActionIcon()}
            </div>
            <div>
              <h2 className="text-xl font-orbitron font-bold text-gray-900">{getActionTitle()}</h2>
              <p className="text-sm text-gray-600 font-exo">
                {agentName} has completed the requested action
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Action Summary */}
          <div className={`bg-gradient-to-r from-${color}-50 to-blue-50 rounded-lg p-6 border border-${color}-200`}>
            <div className="flex items-center gap-3 mb-3">
              <Zap className={`w-6 h-6 text-${color}-600`} />
              <h3 className="font-orbitron font-bold text-gray-900">
                {agentName} ({agentSymbol})
              </h3>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500 font-exo">Action Type</p>
                <p className={`font-exo font-semibold text-${color}-700 capitalize`}>{actionType}</p>
              </div>
              <div>
                <p className="text-gray-500 font-exo">Status</p>
                <span className={`text-sm bg-${color}-100 text-${color}-700 px-3 py-1 rounded-full font-exo font-medium`}>
                  Completed Successfully
                </span>
              </div>
            </div>
          </div>

          {/* Action Details */}
          {actionDetails && (
            <div className="space-y-4">
              <h4 className="font-exo font-semibold text-gray-900">Action Details</h4>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  {actionDetails.pair && (
                    <div>
                      <p className="text-gray-500 font-exo">Trading Pair</p>
                      <p className="font-exo font-medium text-gray-900">{actionDetails.pair}</p>
                    </div>
                  )}
                  {actionDetails.type && (
                    <div>
                      <p className="text-gray-500 font-exo">Position Type</p>
                      <p className={`font-exo font-medium ${
                        actionDetails.type === 'Long' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {actionDetails.type}
                      </p>
                    </div>
                  )}
                  {actionDetails.amount && (
                    <div>
                      <p className="text-gray-500 font-exo">Amount</p>
                      <p className="font-exo font-medium text-gray-900">{actionDetails.amount}</p>
                    </div>
                  )}
                  {actionDetails.price && (
                    <div>
                      <p className="text-gray-500 font-exo">Entry Price</p>
                      <p className="font-exo font-medium text-gray-900">${actionDetails.price}</p>
                    </div>
                  )}
                  {actionDetails.expectedReturn && (
                    <div>
                      <p className="text-gray-500 font-exo">Expected Return</p>
                      <p className="font-exo font-medium text-green-600">+{actionDetails.expectedReturn}%</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Transaction Details */}
          {txHash && (
            <div className="space-y-2">
              <label className="text-sm font-exo font-medium text-gray-700">Transaction Hash</label>
              <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                <span className="font-mono text-sm text-gray-600 truncate flex-1">
                  {txHash}
                </span>
                <button
                  onClick={() => handleCopy(txHash)}
                  className="flex-shrink-0 w-8 h-8 rounded flex items-center justify-center text-gray-500 hover:text-gray-700 hover:bg-gray-200 transition-colors"
                >
                  <Copy className="w-4 h-4" />
                </button>
                <a
                  href={`https://bscscan.com/tx/${txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-shrink-0 w-8 h-8 rounded flex items-center justify-center text-blue-500 hover:text-blue-700 hover:bg-blue-50 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
              {copied && (
                <p className="text-xs text-green-600 font-exo">Copied to clipboard!</p>
              )}
            </div>
          )}

          {/* Action Benefits */}
          <div className={`bg-gradient-to-r from-${color}-50 to-indigo-50 rounded-lg p-6 border border-${color}-200`}>
            <h4 className="font-orbitron font-bold text-gray-900 mb-3">
              ⚡ Action Impact
            </h4>
            <div className="space-y-2 text-sm text-gray-700 font-exo">
              {actionType === 'trade' && (
                <>
                  <p>• New position opened based on AI market analysis</p>
                  <p>• Risk management protocols automatically applied</p>
                  <p>• Position sized according to current portfolio allocation</p>
                  <p>• Stop-loss and take-profit levels set strategically</p>
                </>
              )}
              {actionType === 'analysis' && (
                <>
                  <p>• Comprehensive market analysis completed</p>
                  <p>• New trading opportunities identified</p>
                  <p>• Risk assessment updated with latest data</p>
                  <p>• Strategy recommendations generated</p>
                </>
              )}
              {actionType === 'optimization' && (
                <>
                  <p>• Trading strategies optimized for current conditions</p>
                  <p>• Portfolio allocation rebalanced</p>
                  <p>• Risk parameters adjusted based on performance</p>
                  <p>• Algorithm efficiency improvements applied</p>
                </>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-4">
            <h4 className="font-exo font-semibold text-gray-900">Quick Actions</h4>
            <div className="grid md:grid-cols-2 gap-3">
              <a
                href={`#/agent/${agentSymbol.toLowerCase()}`}
                className={`flex items-center justify-center gap-2 p-4 bg-${color}-50 border border-${color}-200 rounded-lg text-${color}-700 hover:bg-${color}-100 transition-colors font-exo font-medium`}
              >
                <BarChart3 className="w-5 h-5" />
                View Agent Dashboard
              </a>
              {txHash && (
                <a
                  href={`https://bscscan.com/tx/${txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 p-4 bg-blue-50 border border-blue-200 rounded-lg text-blue-700 hover:bg-blue-100 transition-colors font-exo font-medium"
                >
                  <ExternalLink className="w-5 h-5" />
                  View on BSCScan
                </a>
              )}
            </div>
          </div>

          {/* What's Next */}
          <div className="bg-gradient-to-r from-bsc-50 to-green-50 rounded-lg p-6 border border-bsc-200">
            <h4 className="font-orbitron font-bold text-gray-900 mb-3">
              🚀 What's Next?
            </h4>
            <div className="space-y-2 text-sm text-gray-700 font-exo">
              <p>• Monitor the action results in your agent dashboard</p>
              <p>• Check the activity feed for real-time updates</p>
              <p>• Agent will continue autonomous operations</p>
              {actionType === 'trade' && <p>• Track position performance and P&L</p>}
              {actionType === 'analysis' && <p>• Review analysis results and recommendations</p>}
              {actionType === 'optimization' && <p>• Observe improved trading performance</p>}
              <p>• Use "Perform" button again to trigger more actions</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <p className="text-xs text-gray-500 font-exo">
              Action completed on {new Date().toLocaleString()}
            </p>
            <button
              onClick={onClose}
              className={`px-4 py-2 bg-${color}-600 text-white rounded-lg font-exo font-medium hover:bg-${color}-700 transition-colors`}
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PerformSuccessModal