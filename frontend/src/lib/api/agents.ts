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
  evolutionChanges: EvolutionChange[];
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
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true',
        'Access-Control-Allow-Origin': '*',
      },
      mode: 'cors',
    });

    if (!response.ok) {
      const errorData: ErrorResponse = await response.json();
      throw new Error(`API Error: ${errorData.error.message}`);
    }

    const jsonData = await response.json();
    // API returns data wrapped in a 'data' property
    return jsonData.data || jsonData;
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

    const fullUrl = `${config.api.baseURL}/agents?${queryString}`;
    console.log('🚀 Making API call to:', fullUrl);
    console.log('📝 Request params:', params);
    console.log('🔗 Query string:', queryString.toString());

    const response = await fetch(fullUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true',
        'Access-Control-Allow-Origin': '*',
      },
      mode: 'cors',
    });

    console.log('📡 Response status:', response.status);
    console.log('📡 Response ok:', response.ok);
    console.log('📡 Response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      console.error('❌ Response not ok, attempting to parse error');
      const errorText = await response.text();
      console.error('❌ Raw error response:', errorText);

      try {
        const errorData: ErrorResponse = JSON.parse(errorText);
        throw new Error(`API Error: ${errorData.error.message}`);
      } catch (parseError) {
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }
    }

    const rawData = await response.text();
    console.log('📦 Raw response data:', rawData);

    try {
      const jsonData = JSON.parse(rawData);
      console.log('✅ Parsed JSON data:', jsonData);

      // API returns data wrapped in a 'data' property
      const responseData = jsonData.data || jsonData;
      console.log('👥 Agents array:', responseData.agents);
      console.log('📊 Pagination info:', responseData.pagination);

      // Return the unwrapped data structure
      return {
        agents: responseData.agents || [],
        pagination: responseData.pagination || {
          currentPage: 1,
          totalPages: 1,
          totalAgents: responseData.agents?.length || 0,
          limit: 20,
          hasNext: false,
          hasPrev: false
        }
      };
    } catch (parseError) {
      console.error('❌ Failed to parse JSON:', parseError);
      console.error('📦 Raw response was:', rawData);
      throw new Error('Invalid JSON response from API');
    }

  } catch (error) {
    console.error('💥 Complete error in fetchAgentsList:', error);
    console.error('🔍 Error details:', {
      name: error.name,
      message: error.message,
      stack: error.stack
    });
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