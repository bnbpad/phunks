import { useState } from 'react';
import { writeContract } from '@wagmi/core';
import { useAccount } from 'wagmi';
import { bsc } from 'wagmi/chains';
import { config as wagmiConfig } from '../wagmi';
import { config as appConfig } from '../config';
import { handleApiError } from '../api/agents';

// Hook for agent actions (evolve and perform)
export const useAgentActions = () => {
  const [isPerformLoading, setIsPerformLoading] = useState<boolean>(false);
  const [isEvolveLoading, setIsEvolveLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { address } = useAccount();

  const sendRequest = async (agentAddress: string, actionId: number, setLoading: (loading: boolean) => void): Promise<string | undefined> => {
    if (!address) {
      const errorMsg = 'Please connect your wallet first';
      setError(errorMsg);
      throw new Error(errorMsg);
    }

    setLoading(true);
    setError(null);

    try {
      console.log('🚀 Sending request to agent:', agentAddress, 'actionId:', actionId);

      const txHash = await writeContract(wagmiConfig, {
        abi: appConfig.contracts.agentLaunchpad.abi,
        address: appConfig.contracts.agentLaunchpad.address as `0x${string}`,
        functionName: 'sendRequest',
        args: [
          agentAddress as `0x${string}`,  // agent address
          BigInt(actionId)                // actionId as uint256
        ],
        account: address,
        chain: bsc,
      });

      console.log('✅ Transaction successful:', txHash);
      return txHash;
    } catch (err) {
      console.error('❌ Transaction failed:', err);
      const errorMsg = handleApiError(err);
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const evolve = async (agentAddress: string): Promise<string | undefined> => {
    return sendRequest(agentAddress, 1, setIsEvolveLoading);
  };

  const perform = async (agentAddress: string): Promise<string | undefined> => {
    return sendRequest(agentAddress, 0, setIsPerformLoading);
  };

  return {
    sendRequest,
    evolve,
    perform,
    isPerformLoading,
    isEvolveLoading,
    error,
    setError
  };
};