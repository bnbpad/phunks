import React from 'react'
import { X, CheckCircle, ExternalLink, Copy, Twitter, MessageCircle } from 'lucide-react'
import { ICreateToken } from '../../../lib/types/fourMeme'

interface SuccessModalProps {
  isOpen: boolean
  onClose: () => void
  tokenData: ICreateToken
  txHash?: string
  tokenAddress?: string
  fourMemeUrl?: string
}

const SuccessModal: React.FC<SuccessModalProps> = ({
  isOpen,
  onClose,
  tokenData,
  txHash,
  tokenAddress,
  fourMemeUrl
}) => {
  const [copied, setCopied] = React.useState<string | null>(null)

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text)
    setCopied(type)
    setTimeout(() => setCopied(null), 2000)
  }

  const shareToTwitter = () => {
    const text = `🚀 Just launched ${tokenData.basicDetails.name} ($${tokenData.basicDetails.symbol}) on @fourmeme!

${tokenData.basicDetails.desc}

Check it out: ${fourMemeUrl || 'https://four.meme'}

#MemeToken #BSC #DeFi #FourMeme`

    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`
    window.open(twitterUrl, '_blank')
  }

  const shareToTelegram = () => {
    const text = `🚀 Just launched ${tokenData.basicDetails.name} ($${tokenData.basicDetails.symbol}) on Four.Meme!

${tokenData.basicDetails.desc}

Check it out: ${fourMemeUrl || 'https://four.meme'}`

    const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(fourMemeUrl || 'https://four.meme')}&text=${encodeURIComponent(text)}`
    window.open(telegramUrl, '_blank')
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <div>
              <h2 className="text-xl font-orbitron font-bold text-gray-900">Token Created Successfully!</h2>
              <p className="text-sm text-gray-600 font-exo">
                ${tokenData.basicDetails.symbol} is now live on Four.Meme
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
          {/* Token Summary */}
          <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6 border border-green-200">
            <h3 className="font-orbitron font-bold text-gray-900 mb-3">
              {tokenData.basicDetails.name}
            </h3>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-lg font-mono font-semibold text-green-600">
                ${tokenData.basicDetails.symbol}
              </span>
              <span className="text-sm bg-green-100 text-green-700 px-2 py-1 rounded font-exo">
                Live on BSC
              </span>
            </div>
            <p className="text-gray-700 font-exo">{tokenData.basicDetails.desc}</p>
          </div>

          {/* Transaction Details */}
          <div className="grid md:grid-cols-2 gap-4">
            {/* Transaction Hash */}
            {txHash && (
              <div className="space-y-2">
                <label className="text-sm font-exo font-medium text-gray-700">Transaction Hash</label>
                <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                  <span className="font-mono text-sm text-gray-600 truncate flex-1">
                    {txHash}
                  </span>
                  <button
                    onClick={() => handleCopy(txHash, 'txHash')}
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
                {copied === 'txHash' && (
                  <p className="text-xs text-green-600 font-exo">Copied to clipboard!</p>
                )}
              </div>
            )}

            {/* Token Address */}
            {tokenAddress && (
              <div className="space-y-2">
                <label className="text-sm font-exo font-medium text-gray-700">Token Address</label>
                <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                  <span className="font-mono text-sm text-gray-600 truncate flex-1">
                    {tokenAddress}
                  </span>
                  <button
                    onClick={() => handleCopy(tokenAddress, 'address')}
                    className="flex-shrink-0 w-8 h-8 rounded flex items-center justify-center text-gray-500 hover:text-gray-700 hover:bg-gray-200 transition-colors"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                  <a
                    href={`https://bscscan.com/token/${tokenAddress}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-shrink-0 w-8 h-8 rounded flex items-center justify-center text-blue-500 hover:text-blue-700 hover:bg-blue-50 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
                {copied === 'address' && (
                  <p className="text-xs text-green-600 font-exo">Copied to clipboard!</p>
                )}
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="space-y-4">
            <h4 className="font-exo font-semibold text-gray-900">Quick Actions</h4>

            <div className="grid md:grid-cols-2 gap-3">
              {/* View on Four.Meme */}
              {fourMemeUrl && (
                <a
                  href={fourMemeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 p-4 bg-purple-50 border border-purple-200 rounded-lg text-purple-700 hover:bg-purple-100 transition-colors font-exo font-medium"
                >
                  <ExternalLink className="w-5 h-5" />
                  View on Four.Meme
                </a>
              )}

              {/* View on BSCScan */}
              {tokenAddress && (
                <a
                  href={`https://bscscan.com/token/${tokenAddress}`}
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

          {/* Share Section */}
          <div className="space-y-4">
            <h4 className="font-exo font-semibold text-gray-900">Share Your Launch</h4>

            <div className="grid md:grid-cols-2 gap-3">
              <button
                onClick={shareToTwitter}
                className="flex items-center justify-center gap-2 p-4 bg-blue-50 border border-blue-200 rounded-lg text-blue-700 hover:bg-blue-100 transition-colors font-exo font-medium"
              >
                <Twitter className="w-5 h-5" />
                Share on Twitter
              </button>

              <button
                onClick={shareToTelegram}
                className="flex items-center justify-center gap-2 p-4 bg-blue-50 border border-blue-200 rounded-lg text-blue-700 hover:bg-blue-100 transition-colors font-exo font-medium"
              >
                <MessageCircle className="w-5 h-5" />
                Share on Telegram
              </button>
            </div>
          </div>

          {/* AI Agent Status */}
          {tokenData.aiThesis && (
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <h4 className="font-exo font-semibold text-purple-900 mb-2">AI Trading Agent</h4>
              <p className="text-sm text-purple-700 font-exo">
                Your AI agent "{tokenData.aiThesis.name}" has been configured and will begin trading
                according to your strategy once the token gains sufficient liquidity.
              </p>
            </div>
          )}

          {/* Pre-buy Information */}
          {parseFloat(tokenData.tokenomics.amountToBuy || '0') > 0 && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 className="font-exo font-semibold text-green-900 mb-2">Pre-buy Executed</h4>
              <p className="text-sm text-green-700 font-exo">
                Successfully purchased {parseFloat(tokenData.tokenomics.amountToBuy || '0').toFixed(4)} BNB worth of
                {tokenData.basicDetails.symbol} tokens. Check your wallet for the tokens.
              </p>
            </div>
          )}

          {/* What's Next */}
          <div className="bg-gradient-to-r from-bsc-50 to-yellow-50 rounded-lg p-6 border border-bsc-200">
            <h4 className="font-orbitron font-bold text-gray-900 mb-3">
              🎉 What's Next?
            </h4>
            <div className="space-y-2 text-sm text-gray-700 font-exo">
              <p>• Your token is now live and tradeable on Four.Meme</p>
              <p>• Start building your community using the social links you provided</p>
              <p>• Monitor your token's performance on the Four.Meme platform</p>
              {tokenData.aiThesis && <p>• Track your AI agent's trading performance</p>}
              <p>• Consider providing additional liquidity to improve trading experience</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <p className="text-xs text-gray-500 font-exo">
              Token created successfully on {new Date().toLocaleString()}
            </p>
            <button
              onClick={onClose}
              className="px-4 py-2 bsc-gradient text-white rounded-lg font-exo font-medium hover:opacity-90 transition-opacity"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SuccessModal