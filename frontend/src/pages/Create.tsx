import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import CreateStepper from '../components/create/CreateStepper'
import { useWallet } from '../lib/hooks/useWallet'
import { useCreateFourMeme } from '../lib/hooks/useCreateFourMeme'
import { ICreateToken } from '../lib/types/fourMeme'
import SuccessModal from '../components/create/modals/SuccessModal'
import FailureModal from '../components/create/modals/FailureModal'

const Create = () => {
  const navigate = useNavigate()
  const [walletState] = useWallet()
  const [imageFile, setImageFile] = useState<File>()
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string>('')

  // Modal states
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false)
  const [isFailureModalOpen, setIsFailureModalOpen] = useState(false)

  // Initial token data with FourMeme defaults
  const [tokenData, setTokenData] = useState<ICreateToken>({
    selectedDexId: "fourmeme",
    basicDetails: {
      name: '',
      symbol: '',
      desc: '',
      image: '',
      address: '',
      chainId: 56,
      chainType: 'BSC',
    },
    tokenomics: {
      fundingTokenAddress: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
      fundingTokenDecimals: 18,
      fundingTokenSymbol: "BNB",
      amountToBuy: "0",
      totalSupply: 1000000000,
      raisedAmount: 24,
      saleRate: 0.8,
      reserveRate: 0,
    },
    links: {
      telegramLink: '',
      twitterLink: '',
      discordLink: '',
      websiteLink: '',
      twitchLink: '',
    },
    aiThesis: undefined,
    apiKey: '',
    apiSecret: '',
  })

  // Initialize useCreateFourMeme hook
  const {
    createToken,
    isLoading,
    error,
    successData,
    reset
  } = useCreateFourMeme(tokenData, imageFile, uploadedImageUrl)

  const handleDataChange = (updates: Partial<ICreateToken>) => {
    setTokenData(prev => ({
      ...prev,
      ...updates,
      // Ensure basic details are properly merged
      basicDetails: updates.basicDetails
        ? { ...prev.basicDetails, ...updates.basicDetails }
        : prev.basicDetails,
      // Ensure tokenomics are properly merged
      tokenomics: updates.tokenomics
        ? { ...prev.tokenomics, ...updates.tokenomics }
        : prev.tokenomics,
      // Ensure links are properly merged
      links: updates.links
        ? { ...prev.links, ...updates.links }
        : prev.links,
    }))
  }

  // Handle token creation
  const handleCreateToken = async (): Promise<{
    success: boolean;
    txHash?: string;
    error?: string;
  }> => {
    try {
      const result = await createToken()

      if (result.success) {
        setIsSuccessModalOpen(true)
        return {
          success: true,
          txHash: result.txHash,
        }
      } else {
        setIsFailureModalOpen(true)
        return {
          success: false,
          error: result.error,
        }
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Token creation failed'
      setIsFailureModalOpen(true)
      return {
        success: false,
        error: errorMessage,
      }
    }
  }

  // Handle modal actions
  const handleSuccessModalClose = () => {
    setIsSuccessModalOpen(false)
    reset()
    // Optionally redirect to token page or home
    navigate('/')
  }

  const handleFailureModalClose = () => {
    setIsFailureModalOpen(false)
    reset()
  }

  const handleRetryCreation = () => {
    setIsFailureModalOpen(false)
    reset()
    // The user can try again from the stepper
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-5xl font-orbitron font-black text-gray-900">Create Meme Token</h1>
        <p className="text-xl text-gray-600 font-exo">
          Launch your meme token on Four.Meme with AI trading capabilities
        </p>
        <div className="flex items-center justify-center gap-2 text-sm text-gray-500 font-exo">
          <div className="w-4 h-4 bg-bsc-500 diamond-shape"></div>
          <span>Powered by BNB Smart Chain & Four.Meme</span>
        </div>
      </div>

      {/* Main Stepper */}
      <CreateStepper
        data={tokenData}
        onDataChange={handleDataChange}
        onImageHandler={setImageFile}
        onSubmit={handleCreateToken}
        imageFile={imageFile}
        walletConnected={walletState.isConnected}
        walletBalance={walletState.balance.bnb}
      />

      {/* Success Modal */}
      {successData && (
        <SuccessModal
          isOpen={isSuccessModalOpen}
          onClose={handleSuccessModalClose}
          tokenData={tokenData}
          txHash={successData.txHash}
          tokenAddress={successData.tokenAddress}
          fourMemeUrl={successData.fourMemeUrl}
        />
      )}

      {/* Failure Modal */}
      <FailureModal
        isOpen={isFailureModalOpen}
        onClose={handleFailureModalClose}
        onRetry={handleRetryCreation}
        tokenData={tokenData}
        error={error?.message || error}
        txHash={error?.txHash}
      />
    </div>
  )
}

export default Create