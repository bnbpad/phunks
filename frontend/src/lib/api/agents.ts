// Agents API Integration
// Endpoints: GET /agents and GET /agents/:id
import { config } from '../config';

// TypeScript interfaces based on API documentation
export interface Trade {
  id: number;
  description: string;
}

export interface AIActivity {
  id: number;
  time: string;
  title: string;
  description: string;
  type: 'evolution' | 'learning' | 'info' | 'trade' | 'success' | 'warning';
  impact: 'High' | 'Medium' | 'Low';
  metrics: Record<string, string>;
  status: 'active' | 'completed' | 'monitoring' | 'executed' | 'processed';
  evolutionChanges?: EvolutionChange[];
}

export interface EvolutionChange {
  before: string[];
  after: string[];
}

export interface AgentDetailResponse {
  // Header Information
  name: string;
  symbol: string;
  generation: number;
  description: string;
  image: string;

  // Agent Profile Fields
  goals: string;
  memory: string;
  personal: string;
  experiences: string;

  // Recent Trades
  recentTrades: Trade[];

  // AI Activities
  aiActivities: AIActivity[];

  // Evolution Changes Data
  evolutionChanges: {
    [activityId: number]: EvolutionChange[];
  };
}

export interface AgentSummary {
  id: string;
  name: string;
  symbol: string;
  image: string;
  pnl: number;
  health: number;
  evolution: number;
  trades: number;
}

export interface AgentsListParams {
  page?: number;
  limit?: number;
  sortBy?: 'pnl' | 'health' | 'evolution' | 'trades';
  sortOrder?: 'asc' | 'desc';
  search?: string;
}

export interface AgentsListResponse {
  agents: AgentSummary[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalAgents: number;
    limit: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface ErrorResponse {
  error: {
    code: string;
    message: string;
    details?: any;
  };
  timestamp: string;
}

// API Functions
export const fetchAgentDetails = async (agentId: string): Promise<AgentDetailResponse> => {
  try {
    const response = await fetch(`${config.api.baseURL}/agents/${agentId}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData: ErrorResponse = await response.json();
      throw new Error(`API Error: ${errorData.error.message}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching agent details:', error);
    throw error;
  }
};

export const fetchAgentsList = async (params: AgentsListParams = {}): Promise<AgentsListResponse> => {
  try {
    const queryString = new URLSearchParams({
      page: params.page?.toString() || '1',
      limit: params.limit?.toString() || '20',
      sortBy: params.sortBy || 'pnl',
      sortOrder: params.sortOrder || 'desc',
      ...(params.search && { search: params.search })
    });

    const response = await fetch(`${config.api.baseURL}/agents?${queryString}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData: ErrorResponse = await response.json();
      throw new Error(`API Error: ${errorData.error.message}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching agents list:', error);
    throw error;
  }
};

// Helper function to handle API errors
export const handleApiError = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }
  return 'An unknown error occurred';
};