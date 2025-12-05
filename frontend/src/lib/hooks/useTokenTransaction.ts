import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { parseEther, Abi } from 'viem'
import { useState, useCallback, useEffect } from 'react'

export interface TransactionState {
  isPending: boolean
  isConfirming: boolean
  isConfirmed: boolean
  hash: string | null
  error: string | null
  progress: number
  currentStep: string
}

export interface TransactionActions {
  writeContract: (args: {
    abi: Abi
    address: `0x${string}`
    functionName: string
    args?: any[]
    value?: bigint
  }) => Promise<`0x${string}`>
  reset: () => void
}

export function useTokenTransaction(): [TransactionState, TransactionActions] {
  const [hash, setHash] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [progress, setProgress] = useState(0)
  const [currentStep, setCurrentStep] = useState('')

  const {
    writeContract: wagmiWriteContract,
    isPending: isWritePending,
    error: writeError
  } = useWriteContract()

  const {
    isLoading: isConfirming,
    isSuccess: isConfirmed
  } = useWaitForTransactionReceipt({
    hash: hash as `0x${string}` | undefined,
  })

  // Combined pending state
  const isPending = isWritePending || isConfirming

  const writeContract = useCallback(async (args: {
    abi: Abi
    address: `0x${string}`
    functionName: string
    args?: any[]
    value?: bigint
  }): Promise<`0x${string}`> => {
    try {
      setError(null)
      setProgress(25)
      setCurrentStep('Preparing transaction...')

      const result = await wagmiWriteContract({
        abi: args.abi,
        address: args.address,
        functionName: args.functionName,
        args: args.args || [],
        value: args.value || 0n,
      })

      setHash(result)
      setProgress(50)
      setCurrentStep('Transaction submitted, waiting for confirmation...')

      return result
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Transaction failed'
      setError(errorMessage)
      setProgress(0)
      setCurrentStep('')
      throw err
    }
  }, [wagmiWriteContract])

  // Update progress when confirmation state changes
  useEffect(() => {
    if (isConfirming) {
      setProgress(75)
      setCurrentStep('Confirming transaction...')
    }
    if (isConfirmed) {
      setProgress(100)
      setCurrentStep('Transaction confirmed!')
    }
  }, [isConfirming, isConfirmed])

  // Update error from wagmi
  useEffect(() => {
    if (writeError) {
      setError(writeError.message)
      setProgress(0)
      setCurrentStep('')
    }
  }, [writeError])

  const reset = useCallback(() => {
    setHash(null)
    setError(null)
    setProgress(0)
    setCurrentStep('')
  }, [])

  const state: TransactionState = {
    isPending,
    isConfirming,
    isConfirmed,
    hash,
    error,
    progress,
    currentStep,
  }

  const actions: TransactionActions = {
    writeContract,
    reset,
  }

  return [state, actions]
}