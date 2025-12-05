import React from 'react'
import { X, AlertTriangle, RefreshCw, ExternalLink, Copy } from 'lucide-react'
import { ICreateToken } from '../../../lib/types/fourMeme'

interface FailureModalProps {
  isOpen: boolean
  onClose: () => void
  onRetry: () => void
  tokenData: ICreateToken
  error?: string
  txHash?: string
}

const FailureModal: React.FC<FailureModalProps> = ({
  isOpen,
  onClose,
  onRetry,
  tokenData,
  error,
  txHash
}) => {
  const [copied, setCopied] = React.useState(false)

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const getErrorMessage = (errorText?: string): string => {
    if (!errorText) return 'An unexpected error occurred during token creation.'

    // Parse common error types
    if (errorText.includes('insufficient funds') || errorText.includes('insufficient balance')) {
      return 'Insufficient BNB balance to cover transaction fees and token creation cost.'
    }
    if (errorText.includes('user rejected') || errorText.includes('user denied')) {
      return 'Transaction was rejected in your wallet. Please try again and confirm the transaction.'
    }
    if (errorText.includes('gas limit') || errorText.includes('out of gas')) {
      return 'Transaction failed due to insufficient gas. This is usually temporary - please try again.'
    }
    if (errorText.includes('network') || errorText.includes('connection')) {
      return 'Network connection issue. Please check your internet connection and try again.'
    }
    if (errorText.includes('already exists') || errorText.includes('duplicate')) {
      return 'A token with this name or symbol already exists. Please choose different details.'
    }

    // Return original error if we can't categorize it
    return errorText
  }

  const getErrorSolution = (errorText?: string): string[] => {
    if (!errorText) return ['Please try again or contact support if the issue persists.']

    if (errorText.includes('insufficient funds') || errorText.includes('insufficient balance')) {
      return [
        'Add more BNB to your wallet',
        'Reduce the pre-buy amount if you have one configured',
        'Make sure you have at least 0.01 BNB plus any pre-buy amount'
      ]
    }
    if (errorText.includes('user rejected') || errorText.includes('user denied')) {
      return [
        'Click "Try Again" and confirm the transaction in your wallet',
        'Make sure you understand the transaction details before confirming',
        'Check that you\'re connected to the correct wallet'
      ]
    }
    if (errorText.includes('gas limit') || errorText.includes('out of gas')) {
      return [
        'Try the transaction again - gas prices may have changed',
        'Wait a few minutes and retry during less congested network times',
        'Make sure your wallet has enough BNB for gas fees'
      ]
    }
    if (errorText.includes('network') || errorText.includes('connection')) {
      return [
        'Check your internet connection',
        'Try switching to a different RPC endpoint',
        'Ensure you\'re connected to the BNB Smart Chain network'
      ]
    }
    if (errorText.includes('already exists') || errorText.includes('duplicate')) {
      return [
        'Change your token name to something unique',
        'Choose a different token symbol',
        'Verify no existing token has the same details'
      ]
    }

    return [
      'Try the transaction again',
      'Check your wallet connection and network',
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
              <h2 className="text-xl font-orbitron font-bold text-gray-900">Token Creation Failed</h2>
              <p className="text-sm text-gray-600 font-exo">
                ${tokenData.basicDetails.symbol} could not be created
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

          {/* Token Summary */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
            <h3 className="font-orbitron font-bold text-gray-900 mb-3">
              Attempted Token: {tokenData.basicDetails.name}
            </h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm font-exo">
              <div>
                <p><strong>Symbol:</strong> ${tokenData.basicDetails.symbol}</p>
                <p><strong>Pre-buy:</strong> {parseFloat(tokenData.tokenomics.amountToBuy || '0').toFixed(4)} BNB</p>
              </div>
              <div>
                <p><strong>Creation Fee:</strong> 0.01 BNB</p>
                <p><strong>AI Agent:</strong> {tokenData.aiThesis ? 'Enabled' : 'Disabled'}</p>
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
              💡 Common Issues & Solutions
            </h4>
            <div className="space-y-3 text-sm text-gray-700 font-exo">
              <div>
                <p><strong>Insufficient Balance:</strong> Ensure you have enough BNB for creation fee + pre-buy + gas fees</p>
              </div>
              <div>
                <p><strong>Network Issues:</strong> Try refreshing the page and reconnecting your wallet</p>
              </div>
              <div>
                <p><strong>High Gas Fees:</strong> Wait for network congestion to reduce and try again</p>
              </div>
              <div>
                <p><strong>Wallet Issues:</strong> Make sure you're connected to BNB Smart Chain network</p>
              </div>
            </div>
          </div>

          {/* Support Information */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h4 className="font-exo font-semibold text-gray-900 mb-2">Need Help?</h4>
            <div className="space-y-2 text-sm text-gray-700 font-exo">
              <p>If you continue experiencing issues:</p>
              <div className="flex flex-wrap gap-2 mt-2">
                <a
                  href="https://four.meme/support"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800"
                >
                  Four.Meme Support
                  <ExternalLink className="w-3 h-3" />
                </a>
                <span className="text-gray-400">•</span>
                <a
                  href="https://docs.four.meme"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800"
                >
                  Documentation
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
              Try Again
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FailureModal