import { useState, useEffect } from 'react';
import {
  AgentDetailResponse,
  AgentsListResponse,
  AgentsListParams,
  fetchAgentDetails,
  fetchAgentsList,
  handleApiError
} from '../api/agents';

// Hook for fetching individual agent details
export const useAgent = (agentId: string | undefined) => {
  const [agent, setAgent] = useState<AgentDetailResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!agentId) {
      return;
    }

    const loadAgent = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const agentData = await fetchAgentDetails(agentId);
        setAgent(agentData);
      } catch (err) {
        setError(handleApiError(err));
      } finally {
        setIsLoading(false);
      }
    };

    loadAgent();
  }, [agentId]);

  const refetch = async () => {
    if (!agentId) return;

    setIsLoading(true);
    setError(null);

    try {
      const agentData = await fetchAgentDetails(agentId);
      setAgent(agentData);
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setIsLoading(false);
    }
  };

  return {
    agent,
    isLoading,
    error,
    refetch
  };
};

// Hook for fetching agents list
export const useAgents = (params: AgentsListParams = {}) => {
  const [data, setData] = useState<AgentsListResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const loadAgents = async (newParams: AgentsListParams = {}) => {
    setIsLoading(true);
    setError(null);

    try {
      const agentsData = await fetchAgentsList({ ...params, ...newParams });
      setData(agentsData);
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAgents();
  }, [params.page, params.limit, params.sortBy, params.sortOrder, params.search]);

  const refetch = () => loadAgents();

  return {
    agents: data?.agents || [],
    pagination: data?.pagination,
    isLoading,
    error,
    refetch,
    loadAgents
  };
};