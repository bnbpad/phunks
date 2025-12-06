import React from 'react'
import { X, AlertTriangle, RefreshCw, ExternalLink, Copy } from 'lucide-react'

interface PerformFailureModalProps {
  isOpen: boolean
  onClose: () => void
  onRetry: () => void
  agentName: string
  agentSymbol: string
  actionType: 'trade' | 'analysis' | 'optimization'
  error?: string
  txHash?: string
}

const PerformFailureModal: React.FC<PerformFailureModalProps> = ({
  isOpen,
  onClose,
  onRetry,
  agentName,
  agentSymbol,
  actionType,
  error,
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
        return 'Trade Execution Failed'
      case 'analysis':
        return 'Market Analysis Failed'
      case 'optimization':
        return 'Strategy Optimization Failed'
      default:
        return 'Action Failed'
    }
  }

  const getErrorMessage = (errorText?: string): string => {
    if (!errorText) return `An unexpected error occurred during ${actionType} execution.`

    // Parse common error types
    if (errorText.includes('insufficient funds') || errorText.includes('insufficient balance')) {
      return 'Insufficient BNB balance to cover transaction fees and action costs.'
    }
    if (errorText.includes('user rejected') || errorText.includes('user denied')) {
      return 'Action transaction was rejected in your wallet. Please try again and confirm the transaction.'
    }
    if (errorText.includes('gas limit') || errorText.includes('out of gas')) {
      return 'Action failed due to insufficient gas. This is usually temporary - please try again.'
    }
    if (errorText.includes('network') || errorText.includes('connection')) {
      return 'Network connection issue. Please check your internet connection and try again.'
    }
    if (errorText.includes('slippage') || errorText.includes('price impact')) {
      return 'Trade failed due to high slippage or price impact. Market conditions may have changed.'
    }
    if (errorText.includes('insufficient liquidity')) {
      return 'Insufficient liquidity in the market for the requested trade size.'
    }
    if (errorText.includes('market closed') || errorText.includes('trading halted')) {
      return 'Market is currently closed or trading is temporarily halted.'
    }
    if (errorText.includes('cooldown') || errorText.includes('rate limit')) {
      return 'Agent is on cooldown. Please wait before triggering another action.'
    }

    // Return original error if we can't categorize it
    return errorText
  }

  const getErrorSolution = (errorText?: string): string[] => {
    if (!errorText) return ['Please try again or contact support if the issue persists.']

    if (errorText.includes('insufficient funds') || errorText.includes('insufficient balance')) {
      return [
        'Add more BNB to your wallet for transaction fees',
        'Reduce trade size if attempting a large position',
        'Check wallet balance and ensure sufficient funds'
      ]
    }
    if (errorText.includes('user rejected') || errorText.includes('user denied')) {
      return [
        'Click "Try Again" and confirm the transaction in your wallet',
        'Review the action details before confirming',
        'Ensure you\'re connected to the correct wallet'
      ]
    }
    if (errorText.includes('gas limit') || errorText.includes('out of gas')) {
      return [
        'Try the action again - gas prices may have changed',
        'Wait for network congestion to reduce',
        'Ensure wallet has enough BNB for gas fees'
      ]
    }
    if (errorText.includes('network') || errorText.includes('connection')) {
      return [
        'Check your internet connection',
        'Try switching to a different RPC endpoint',
        'Ensure you\'re connected to the BNB Smart Chain network'
      ]
    }
    if (errorText.includes('slippage') || errorText.includes('price impact')) {
      return [
        'Wait for market conditions to stabilize',
        'Reduce trade size to minimize price impact',
        'Check for major market news or events'
      ]
    }
    if (errorText.includes('insufficient liquidity')) {
      return [
        'Reduce the trade size',
        'Try again when market liquidity improves',
        'Consider trading during active market hours'
      ]
    }
    if (errorText.includes('market closed') || errorText.includes('trading halted')) {
      return [
        'Wait for market to reopen',
        'Check market hours and trading schedule',
        'Monitor for trading resumption announcements'
      ]
    }
    if (errorText.includes('cooldown') || errorText.includes('rate limit')) {
      return [
        'Wait for the cooldown period to end',
        'Check agent dashboard for cooldown timer',
        'Cooldowns prevent spam and ensure optimal performance'
      ]
    }

    return [
      'Try the action again',
      'Check market conditions and network status',
      'Contact support if the issue persists'
    ]
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
            <div>
              <h2 className="text-xl font-orbitron font-bold text-gray-900">{getActionTitle()}</h2>
              <p className="text-sm text-gray-600 font-exo">
                {agentName} could not complete the action
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
          {/* Error Message */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h3 className="font-exo font-semibold text-red-900 mb-3">What went wrong?</h3>
            <p className="text-red-800 font-exo leading-relaxed">
              {getErrorMessage(error)}
            </p>
          </div>

          {/* Failed Transaction Details */}
          {txHash && (
            <div className="space-y-2">
              <label className="text-sm font-exo font-medium text-gray-700">Failed Transaction Hash</label>
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

          {/* Agent Summary */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
            <h3 className="font-orbitron font-bold text-gray-900 mb-3">
              Attempted Action: {agentName} ({agentSymbol})
            </h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm font-exo">
              <div>
                <p><strong>Action Type:</strong> {actionType.charAt(0).toUpperCase() + actionType.slice(1)}</p>
                <p><strong>Agent:</strong> {agentName}</p>
              </div>
              <div>
                <p><strong>Network:</strong> BNB Smart Chain</p>
                <p><strong>Action Fee:</strong> ~0.01 BNB</p>
              </div>
            </div>
          </div>

          {/* Solutions */}
          <div className="space-y-4">
            <h4 className="font-exo font-semibold text-gray-900">How to fix this:</h4>
            <div className="space-y-3">
              {getErrorSolution(error).map((solution, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                    {index + 1}
                  </div>
                  <p className="text-gray-700 font-exo">{solution}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Common Issues */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h4 className="font-orbitron font-bold text-gray-900 mb-3">
              💡 Common Action Issues
            </h4>
            <div className="space-y-3 text-sm text-gray-700 font-exo">
              <div>
                <p><strong>Market Conditions:</strong> Volatile markets can cause trade failures due to slippage</p>
              </div>
              <div>
                <p><strong>Network Congestion:</strong> High gas fees during peak times can fail transactions</p>
              </div>
              <div>
                <p><strong>Liquidity Issues:</strong> Low liquidity pairs may not support large trade sizes</p>
              </div>
              <div>
                <p><strong>Action Cooldowns:</strong> Agents have cooldowns to prevent spam and ensure quality</p>
              </div>
            </div>
          </div>

          {/* Action Information */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h4 className="font-orbitron font-bold text-gray-900 mb-3">
              ⚡ About Agent Actions
            </h4>
            <div className="space-y-2 text-sm text-gray-700 font-exo">
              <p>Agent actions trigger AI-powered operations based on current market conditions:</p>
              <div className="mt-3 space-y-1 ml-4">
                <p>• <strong>Trade:</strong> Execute buy/sell orders based on AI analysis</p>
                <p>• <strong>Analysis:</strong> Perform comprehensive market research</p>
                <p>• <strong>Optimization:</strong> Improve trading strategies and parameters</p>
                <p>• All actions require blockchain confirmation and gas fees</p>
              </div>
            </div>
          </div>

          {/* Support Information */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h4 className="font-exo font-semibold text-gray-900 mb-2">Need Help?</h4>
            <div className="space-y-2 text-sm text-gray-700 font-exo">
              <p>If you continue experiencing action failures:</p>
              <div className="flex flex-wrap gap-2 mt-2">
                <a
                  href="#support"
                  className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800"
                >
                  Agent Support
                  <ExternalLink className="w-3 h-3" />
                </a>
                <span className="text-gray-400">•</span>
                <a
                  href="#docs"
                  className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800"
                >
                  Action Guide
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>

          {/* Raw Error Details (for debugging) */}
          {error && (
            <details className="bg-gray-100 rounded-lg p-4">
              <summary className="text-sm font-exo font-medium text-gray-700 cursor-pointer">
                Technical Details (for debugging)
              </summary>
              <pre className="mt-3 text-xs text-gray-600 font-mono whitespace-pre-wrap break-words">
                {error}
              </pre>
            </details>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 font-exo font-medium hover:bg-gray-50 transition-colors"
            >
              Close
            </button>
            <button
              onClick={onRetry}
              className="flex items-center gap-2 px-6 py-2 bsc-gradient text-white rounded-lg font-exo font-medium hover:opacity-90 transition-opacity"
            >
              <RefreshCw className="w-4 h-4" />
              Try Action Again
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PerformFailureModal