import React from 'react'
import { X, CheckCircle, ExternalLink, Copy, TrendingUp, Brain } from 'lucide-react'

interface EvolveSuccessModalProps {
  isOpen: boolean
  onClose: () => void
  agentName: string
  agentSymbol: string
  oldGeneration: number
  newGeneration: number
  evolutionChanges?: Array<{
    category: string
    field: string
    oldValue: string
    newValue: string
    change: 'improved' | 'declined' | 'new'
  }>
  txHash?: string
}

const EvolveSuccessModal: React.FC<EvolveSuccessModalProps> = ({
  isOpen,
  onClose,
  agentName,
  agentSymbol,
  oldGeneration,
  newGeneration,
  evolutionChanges = [],
  txHash
}) => {
  const [copied, setCopied] = React.useState(false)

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <TrendingUp className="w-8 h-8 text-purple-600" />
            </div>
            <div>
              <h2 className="text-xl font-orbitron font-bold text-gray-900">Evolution Complete!</h2>
              <p className="text-sm text-gray-600 font-exo">
                {agentName} has successfully evolved
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
          {/* Evolution Summary */}
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-6 border border-purple-200">
            <div className="flex items-center gap-3 mb-3">
              <Brain className="w-6 h-6 text-purple-600" />
              <h3 className="font-orbitron font-bold text-gray-900">
                {agentName} ({agentSymbol})
              </h3>
            </div>
            <div className="flex items-center gap-4 mb-3">
              <div className="text-center">
                <p className="text-xs text-gray-500 font-exo">Previous Generation</p>
                <span className="text-lg font-mono font-semibold text-gray-600">
                  Gen {oldGeneration}
                </span>
              </div>
              <div className="flex-1 h-0.5 bg-gradient-to-r from-purple-300 to-blue-300 rounded-full"></div>
              <div className="text-center">
                <p className="text-xs text-gray-500 font-exo">New Generation</p>
                <span className="text-lg font-mono font-semibold text-purple-600">
                  Gen {newGeneration}
                </span>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <span className="text-sm bg-purple-100 text-purple-700 px-3 py-1 rounded-full font-exo font-medium">
                Evolution Successful
              </span>
            </div>
          </div>

          {/* Transaction Details */}
          {txHash && (
            <div className="space-y-2">
              <label className="text-sm font-exo font-medium text-gray-700">Evolution Transaction</label>
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

          {/* Evolution Changes */}
          {evolutionChanges.length > 0 && (
            <div className="space-y-4">
              <h4 className="font-exo font-semibold text-gray-900">Evolution Changes</h4>
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {evolutionChanges.map((change, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-exo font-medium text-gray-700">{change.category}</span>
                      <span className={`text-xs px-2 py-1 rounded-full font-exo font-medium ${
                        change.change === 'improved'
                          ? 'bg-green-100 text-green-700'
                          : change.change === 'new'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {change.change}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 font-exo font-medium">{change.field}</p>
                    <div className="mt-2 grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <span className="text-gray-500 font-exo">Before:</span>
                        <p className="text-gray-700 font-exo mt-1 line-clamp-2">{change.oldValue}</p>
                      </div>
                      <div>
                        <span className="text-gray-500 font-exo">After:</span>
                        <p className="text-purple-700 font-exo mt-1 line-clamp-2">{change.newValue}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Evolution Benefits */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-6 border border-purple-200">
            <h4 className="font-orbitron font-bold text-gray-900 mb-3">
              🧠 Evolution Benefits
            </h4>
            <div className="space-y-2 text-sm text-gray-700 font-exo">
              <p>• Enhanced AI capabilities and decision-making algorithms</p>
              <p>• Improved trading strategies based on market learning</p>
              <p>• Better risk management and position sizing</p>
              <p>• Advanced pattern recognition and trend analysis</p>
              <p>• Optimized performance for current market conditions</p>
            </div>
          </div>

          {/* What's Next */}
          <div className="bg-gradient-to-r from-bsc-50 to-purple-50 rounded-lg p-6 border border-bsc-200">
            <h4 className="font-orbitron font-bold text-gray-900 mb-3">
              🚀 What's Next?
            </h4>
            <div className="space-y-2 text-sm text-gray-700 font-exo">
              <p>• Your agent will begin using its evolved capabilities immediately</p>
              <p>• Monitor performance improvements in the trading dashboard</p>
              <p>• Evolution changes will be reflected in agent behavior</p>
              <p>• Future evolutions will build upon these improvements</p>
              <p>• Check the activity feed for real-time evolution impact</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <p className="text-xs text-gray-500 font-exo">
              Evolution completed on {new Date().toLocaleString()}
            </p>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg font-exo font-medium hover:bg-purple-700 transition-colors"
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EvolveSuccessModal