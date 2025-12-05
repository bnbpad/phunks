import { useState, useCallback } from 'react'

export interface WalletError {
  type: 'connection' | 'transaction' | 'network' | 'balance' | 'general'
  message: string
  code?: string | number
  timestamp: number
}

export interface WalletErrorState {
  currentError: WalletError | null
  errorHistory: WalletError[]
  hasError: boolean
}

export interface WalletErrorActions {
  setError: (error: Omit<WalletError, 'timestamp'>) => void
  clearError: () => void
  clearAllErrors: () => void
  getErrorByType: (type: WalletError['type']) => WalletError | null
}

export function useWalletError(): [WalletErrorState, WalletErrorActions] {
  const [currentError, setCurrentError] = useState<WalletError | null>(null)
  const [errorHistory, setErrorHistory] = useState<WalletError[]>([])

  const setError = useCallback((error: Omit<WalletError, 'timestamp'>) => {
    const newError: WalletError = {
      ...error,
      timestamp: Date.now(),
    }

    setCurrentError(newError)
    setErrorHistory(prev => [newError, ...prev.slice(0, 9)]) // Keep last 10 errors
  }, [])

  const clearError = useCallback(() => {
    setCurrentError(null)
  }, [])

  const clearAllErrors = useCallback(() => {
    setCurrentError(null)
    setErrorHistory([])
  }, [])

  const getErrorByType = useCallback((type: WalletError['type']) => {
    return errorHistory.find(error => error.type === type) || null
  }, [errorHistory])

  const state: WalletErrorState = {
    currentError,
    errorHistory,
    hasError: currentError !== null,
  }

  const actions: WalletErrorActions = {
    setError,
    clearError,
    clearAllErrors,
    getErrorByType,
  }

  return [state, actions]
}

// Helper function to format common wallet errors
export function formatWalletError(error: unknown): Omit<WalletError, 'timestamp'> {
  if (error instanceof Error) {
    // Check for common wallet errors
    if (error.message.includes('User rejected')) {
      return {
        type: 'connection',
        message: 'Connection request was rejected',
        code: 'USER_REJECTED_REQUEST',
      }
    }

    if (error.message.includes('Unsupported chain')) {
      return {
        type: 'network',
        message: 'Please switch to BNB Smart Chain (BSC)',
        code: 'UNSUPPORTED_CHAIN',
      }
    }

    if (error.message.includes('insufficient funds')) {
      return {
        type: 'transaction',
        message: 'Insufficient funds for transaction',
        code: 'INSUFFICIENT_FUNDS',
      }
    }

    if (error.message.includes('gas')) {
      return {
        type: 'transaction',
        message: 'Transaction failed due to gas estimation error',
        code: 'GAS_ESTIMATION_FAILED',
      }
    }

    return {
      type: 'general',
      message: error.message,
    }
  }

  return {
    type: 'general',
    message: 'An unknown error occurred',
  }
}