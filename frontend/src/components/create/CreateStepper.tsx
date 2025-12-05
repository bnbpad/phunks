import React, { useState } from 'react'
import {
  FileText,
  Share2,
  Brain,
  CreditCard,
  Receipt,
  CheckCircle,
  ArrowLeft,
  ArrowRight,
  Loader2
} from 'lucide-react'
import { ICreateToken } from '../../lib/types/fourMeme'
import { useWallet } from '../../lib/hooks/useWallet'

// Step Components
import Step1BasicDetails from './steps/Step1BasicDetails'
import Step2SocialLinks from './steps/Step2SocialLinks'
import Step3AIThesis from './steps/Step3AIThesis'
import Step6Confirmation from './steps/Step6Confirmation'

interface CreateStepperProps {
  data: ICreateToken
  onDataChange: (updates: Partial<ICreateToken>) => void
  onImageHandler: (file: File | undefined) => void
  onSubmit: () => Promise<{ success: boolean; txHash?: string; error?: string }>
  imageFile?: File
  walletConnected: boolean
  walletBalance?: string
}

const CreateStepper: React.FC<CreateStepperProps> = ({
  data,
  onDataChange,
  onImageHandler,
  onSubmit,
  imageFile,
  walletConnected,
  walletBalance
}) => {
  const [currentStep, setCurrentStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [walletState] = useWallet()

  const steps = [
    { num: 1, label: 'Basic Details', icon: FileText, description: 'Token information' },
    { num: 2, label: 'Social Links', icon: Share2, description: 'Community links' },
    { num: 3, label: 'AI Trading', icon: Brain, description: 'AI agent setup' },
    { num: 4, label: 'Launch', icon: CheckCircle, description: 'Review & Deploy' },
  ]

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async () => {
    setIsLoading(true)
    try {
      await onSubmit()
    } finally {
      setIsLoading(false)
    }
  }

  const isStepValid = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(data.basicDetails.name && data.basicDetails.symbol && data.basicDetails.desc)
      case 2:
        return true // Social links are optional
      case 3:
        // AI thesis is optional, but if enabled, all fields are required
        if (!data.aiThesis) return true
        return !!(
          data.aiThesis.goals &&
          data.aiThesis.memory &&
          data.aiThesis.persona &&
          data.aiThesis.experience
        )
      case 4:
        return walletConnected && parseFloat(walletBalance || '0') >= 0.01
      default:
        return false
    }
  }

  const canProceed = isStepValid(currentStep)

  const getBalanceNumber = (): number => {
    return parseFloat(walletBalance || '0')
  }

  const creationFee = 0.01
  const totalCost = creationFee
  const userBalance = getBalanceNumber()
  const hasInsufficientBalance = totalCost > userBalance

  const renderStepContent = () => {
    const commonProps = {
      data,
      onDataChange,
      onImageChange: onImageHandler,
      walletConnected,
      walletBalance,
      isLoading
    }

    switch (currentStep) {
      case 1:
        return <Step1BasicDetails {...commonProps} imageFile={imageFile} />
      case 2:
        return <Step2SocialLinks {...commonProps} />
      case 3:
        return <Step3AIThesis {...commonProps} />
      case 4:
        return <Step6Confirmation {...commonProps} onSubmit={handleSubmit} />
      default:
        return null
    }
  }

  return (
    <div className="space-y-8">
      {/* Progress Indicator */}
      <div className="flex items-center justify-between mb-12">
        {steps.map((step, idx) => {
          const Icon = step.icon
          const isActive = currentStep === step.num
          const isComplete = currentStep > step.num
          const isValid = isStepValid(step.num)

          return (
            <React.Fragment key={step.num}>
              <div className="flex flex-col items-center gap-2">
                <div
                  className={`w-16 h-16 rounded-full flex items-center justify-center border-2 transition-all cursor-pointer ${
                    isActive
                      ? 'bg-bsc-100 border-bsc-500'
                      : isComplete
                      ? 'bg-green-100 border-green-500'
                      : isValid
                      ? 'bg-gray-100 border-gray-300 hover:border-bsc-300'
                      : 'bg-gray-50 border-gray-200'
                  }`}
                  onClick={() => {
                    if (step.num <= currentStep || isValid) {
                      setCurrentStep(step.num)
                    }
                  }}
                >
                  <Icon className={`w-8 h-8 ${
                    isActive
                      ? 'text-bsc-600'
                      : isComplete
                      ? 'text-green-600'
                      : 'text-gray-400'
                  }`} />
                </div>
                <div className="text-center">
                  <span className={`text-sm font-exo font-medium ${
                    isActive ? 'text-bsc-600' : 'text-gray-500'
                  }`}>
                    {step.label}
                  </span>
                  <p className="text-xs text-gray-400 font-exo">{step.description}</p>
                </div>
              </div>
              {idx < steps.length - 1 && (
                <div className={`flex-1 h-0.5 ${
                  isComplete ? 'bg-green-500' : 'bg-gray-300'
                }`}></div>
              )}
            </React.Fragment>
          )
        })}
      </div>

      {/* Step Content */}
      <div className="bg-white card-shadow rounded-xl p-8">
        {renderStepContent()}

        {/* Navigation */}
        <div className="flex items-center justify-between pt-6 mt-8 border-t border-gray-200">
          <button
            onClick={handlePrev}
            disabled={currentStep === 1}
            className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-300 rounded-lg font-exo font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowLeft className="w-5 h-5" />
            Previous
          </button>

          {currentStep < 4 ? (
            <button
              onClick={handleNext}
              disabled={!canProceed}
              className="flex items-center gap-2 px-6 py-3 bsc-gradient rounded-lg font-exo font-medium text-white hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next Step
              <ArrowRight className="w-5 h-5" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={!walletState.isConnected || !walletState.isCorrectNetwork || hasInsufficientBalance || isLoading}
              className={`flex items-center gap-2 px-8 py-4 rounded-lg font-exo font-semibold text-lg transition-all ${
                !walletState.isConnected || !walletState.isCorrectNetwork || hasInsufficientBalance || isLoading
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bsc-gradient text-white hover:opacity-90'
              }`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  Creating Token...
                </>
              ) : (
                <>
                  <CheckCircle className="w-6 h-6" />
                  Launch Token
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default CreateStepper