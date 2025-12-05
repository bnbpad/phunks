import React, { useEffect } from 'react'
import { CheckCircle, Loader2, ExternalLink, Image as ImageIcon, Share2, Brain, Wallet } from 'lucide-react'
import { ICreateToken } from '../../../lib/types/fourMeme'
import { useWallet } from '../../../lib/hooks/useWallet'
import { ConnectWallet } from '../../ConnectWallet'
import { BalanceDisplay } from '../../BalanceDisplay'

interface Step6ConfirmationProps {
  data: ICreateToken
  onDataChange: (updates: Partial<ICreateToken>) => void
  walletConnected: boolean
  walletBalance?: string
  imageFile?: File
  uploadedImageUrl?: string
  onSubmit: () => Promise<void>
  isLoading?: boolean
}

const Step6Confirmation: React.FC<Step6ConfirmationProps> = ({
  data,
  onDataChange,
  walletConnected,
  walletBalance,
  imageFile,
  uploadedImageUrl,
  onSubmit,
  isLoading = false
}) => {
  const [walletState] = useWallet()
  useEffect(() => {
    if (onDataChange && data.tokenomics.amountToBuy !== '0') {
      onDataChange({
        tokenomics: {
          ...data.tokenomics,
          amountToBuy: '0'
        }
      })
    }
  }, []) // Only run once on mount
  const getBalanceNumber = (): number => {
    return parseFloat(walletBalance || '0')
  }

  const creationFee = 0.01
  const totalCost = creationFee
  const userBalance = getBalanceNumber()
  const remainingBalance = userBalance - totalCost

  const hasInsufficientBalance = totalCost > userBalance

  const getSocialLinksCount = (): number => {
    return Object.values(data.links).filter(link => link && link.trim()).length
  }


  return (
    <div className="space-y-6">
      {/* Token Summary Card */}
      <div className="bg-gradient-to-r from-bsc-50 to-purple-50 rounded-lg p-6 border border-bsc-200">
        <div className="flex items-start gap-6">
          {/* Token Image */}
          <div className="flex-shrink-0">
            <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
              {(imageFile || uploadedImageUrl) ? (
                <img
                  src={imageFile ? URL.createObjectURL(imageFile) : uploadedImageUrl}
                  alt="Token"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <ImageIcon className="w-8 h-8 text-gray-400" />
                </div>
              )}
            </div>
          </div>

          {/* Token Details */}
          <div className="flex-1 space-y-3">
            <div>
              <h3 className="text-xl font-orbitron font-bold text-gray-900">
                {data.basicDetails.name || 'Unnamed Token'}
              </h3>
              <p className="text-lg font-mono font-medium text-bsc-600">
                ${data.basicDetails.symbol || 'SYMBOL'}
              </p>
            </div>
            <p className="text-gray-700 font-exo leading-relaxed">
              {data.basicDetails.desc || 'No description provided'}
            </p>
            <div className="flex items-center gap-4 text-sm font-exo">
              <div className="flex items-center gap-1">
                <Share2 className="w-4 h-4 text-gray-500" />
                <span className="text-gray-600">{getSocialLinksCount()} social links</span>
              </div>
              {data.aiThesis && (
                <div className="flex items-center gap-1">
                  <Brain className="w-4 h-4 text-purple-500" />
                  <span className="text-gray-600">AI Agent enabled</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>


      {/* Tokenomics Summary */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Token Economics */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h4 className="font-orbitron font-bold text-gray-900 mb-4">Token Economics</h4>
          <div className="space-y-3 text-sm font-exo">
            <div className="flex justify-between">
              <span className="text-gray-600">Total Supply:</span>
              <span className="font-semibold text-gray-900">1,000,000,000 {data.basicDetails.symbol}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Available for Sale:</span>
              <span className="font-semibold text-gray-900">800,000,000 (80%)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Total Raise Target:</span>
              <span className="font-semibold text-gray-900">24 BNB</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Platform:</span>
              <span className="font-semibold text-gray-900">Four.Meme DEX</span>
            </div>
          </div>
        </div>

        {/* Transaction Cost */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h4 className="font-orbitron font-bold text-gray-900 mb-4">Transaction Summary</h4>
          <div className="space-y-3 text-sm font-exo">
            <div className="flex justify-between">
              <span className="text-gray-600">Creation Fee:</span>
              <span className="font-mono font-semibold text-gray-900">0.0100 BNB</span>
            </div>
            <hr className="border-gray-200" />
            <div className="flex justify-between">
              <span className="font-semibold text-gray-900">Total Cost:</span>
              <span className="font-mono font-bold text-bsc-600">{totalCost.toFixed(4)} BNB</span>
            </div>
          </div>
        </div>
      </div>

      {/* AI Agent Configuration */}
      {data.aiThesis && (
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
          <h4 className="font-orbitron font-bold text-gray-900 mb-4">AI Agent Configuration</h4>
          <div className="space-y-3">
            <div className="bg-white rounded-lg p-4 border border-purple-200">
              <h5 className="font-semibold text-purple-900 mb-2">🎯 Goals & Objectives</h5>
              <p className="text-sm text-gray-700 font-exo leading-relaxed">
                {data.aiThesis.goals || 'No goals defined'}
              </p>
            </div>

            <div className="bg-white rounded-lg p-4 border border-purple-200">
              <h5 className="font-semibold text-purple-900 mb-2">🧠 Memory & History</h5>
              <p className="text-sm text-gray-700 font-exo leading-relaxed">
                {data.aiThesis.memory || 'No memory context defined'}
              </p>
            </div>

            <div className="bg-white rounded-lg p-4 border border-purple-200">
              <h5 className="font-semibold text-purple-900 mb-2">👤 Personality & Persona</h5>
              <p className="text-sm text-gray-700 font-exo leading-relaxed">
                {data.aiThesis.persona || 'No persona defined'}
              </p>
            </div>

            <div className="bg-white rounded-lg p-4 border border-purple-200">
              <h5 className="font-semibold text-purple-900 mb-2">💡 Experience & Expertise</h5>
              <p className="text-sm text-gray-700 font-exo leading-relaxed">
                {data.aiThesis.experience || 'No experience defined'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Social Links */}
      {getSocialLinksCount() > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h4 className="font-orbitron font-bold text-gray-900 mb-4">Community Links</h4>
          <div className="grid md:grid-cols-2 gap-4 text-sm font-exo">
            {Object.entries(data.links).map(([key, value]) => {
              if (!value) return null
              const linkLabels: Record<string, string> = {
                twitterLink: 'Twitter',
                telegramLink: 'Telegram',
                websiteLink: 'Website',
                discordLink: 'Discord',
                twitchLink: 'Twitch'
              }
              return (
                <div key={key} className="flex items-center justify-between">
                  <span className="text-gray-600">{linkLabels[key] || key}:</span>
                  <a
                    href={value}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                  >
                    Visit
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Balance Check */}
      <div className={`p-6 rounded-lg border ${
        !walletState.isConnected || !walletState.isCorrectNetwork
          ? 'bg-red-50 border-red-200'
          : hasInsufficientBalance
          ? 'bg-red-50 border-red-200'
          : 'bg-green-50 border-green-200'
      }`}>
        <div className="flex items-center gap-3">
          {!walletState.isConnected ? (
            <>
              <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                <span className="text-red-600 text-sm font-bold">!</span>
              </div>
              <div>
                <p className="font-exo font-semibold text-red-800">Wallet Not Connected</p>
                <p className="text-sm text-red-700 font-exo">Please connect your wallet to proceed</p>
              </div>
            </>
          ) : !walletState.isCorrectNetwork ? (
            <>
              <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                <span className="text-red-600 text-sm font-bold">!</span>
              </div>
              <div>
                <p className="font-exo font-semibold text-red-800">Wrong Network</p>
                <p className="text-sm text-red-700 font-exo">Please switch to BNB Smart Chain (BSC)</p>
              </div>
            </>
          ) : hasInsufficientBalance ? (
            <>
              <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                <span className="text-red-600 text-sm font-bold">!</span>
              </div>
              <div>
                <p className="font-exo font-semibold text-red-800">Insufficient Balance</p>
                <p className="text-sm text-red-700 font-exo">
                  Need {totalCost.toFixed(4)} BNB, have {userBalance.toFixed(4)} BNB
                </p>
              </div>
            </>
          ) : (
            <>
              <CheckCircle className="w-8 h-8 text-green-600" />
              <div>
                <p className="font-exo font-semibold text-green-800">Ready to Launch</p>
                <p className="text-sm text-green-700 font-exo">
                  Balance: {userBalance.toFixed(4)} BNB → {remainingBalance.toFixed(4)} BNB after creation
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Wallet Connection Section */}
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-orbitron font-bold text-gray-900">Wallet Connection</h3>
              <ConnectWallet />
            </div>

            {!walletState.isConnected ? (
              <div className="text-center py-8">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Wallet className="w-6 h-6 text-gray-400" />
                </div>
                <p className="text-gray-600 font-exo">Connect your wallet to create tokens on FourMeme</p>
                <p className="text-sm text-gray-500 font-exo mt-2">BSC network required</p>
              </div>
            ) : !walletState.isCorrectNetwork ? (
              <div className="text-center py-8">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Wallet className="w-6 h-6 text-red-500" />
                </div>
                <p className="text-red-600 font-exo mb-2">Wrong network detected</p>
                <p className="text-gray-600 font-exo">Please switch to BNB Smart Chain (BSC)</p>
              </div>
            ) : (
              <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-green-700 font-exo">Wallet connected to BSC</span>
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-1">
          {walletState.isConnected && walletState.isCorrectNetwork && <BalanceDisplay />}
        </div>
      </div>


      {/* What Happens Next */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 border border-blue-200">
        <h4 className="font-orbitron font-bold text-gray-900 mb-4">
          🚀 Token Launch Process
        </h4>
        <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-700 font-exo">
          <div className="space-y-2">
            <p>• <strong>Wallet Signature:</strong> Confirm transaction in your wallet</p>
            <p>• <strong>Token Deployment:</strong> Smart contract deployed on BSC</p>
          </div>
          <div className="space-y-2">
            <p>• <strong>Liquidity Addition:</strong> Trading pool created on Four.Meme</p>
            <p>• <strong>Live Trading:</strong> Token immediately available for trading</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Step6Confirmation