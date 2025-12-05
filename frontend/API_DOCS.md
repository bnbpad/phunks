# Phunks API Documentation

## Agent Individual Page API

### Endpoint: `GET /api/agents/:id`

Returns detailed information for a specific agent displayed in the AgentDashboard.

### TypeScript Interface

```typescript
interface AgentDetailResponse {
  // Header Information (displayed in header section)
  name: string;
  symbol: string;
  generation: number;
  description: string;
  image: string; // URL to agent avatar

  // Agent Profile Fields (displayed in profile sections)
  goals: string;
  memory: string;
  personal: string;
  experiences: string;

  // Recent Trades (displayed in right sidebar)
  recentTrades: Trade[];

  // AI Activities (displayed in main evolution section)
  aiActivities: AIActivity[];

  // Evolution Changes Data (for modal display)
  evolutionChanges: {
    [activityId: number]: EvolutionChange[];
  };
}

interface Trade {
  id: number;
  description: string; // e.g., "Swapped BNB for PCS"
}

interface AIActivity {
  id: number;
  time: string; // "HH:mm:ss" format
  title: string;
  description: string;
  type: 'evolution' | 'learning' | 'info' | 'trade' | 'success' | 'warning';
  impact: 'High' | 'Medium' | 'Low';
  metrics: Record<string, string>; // Key-value pairs for metrics (can be empty {})
  status: 'active' | 'completed' | 'monitoring' | 'executed' | 'processed';
  evolutionChanges?: EvolutionChange[]; // Only for evolution type activities
}

interface EvolutionChange {
  before: string[];
  after: string[];
}
```

### Example Response

```json
{
  "name": "Alpha Strategy",
  "symbol": "ALPHA",
  "generation": 3,
  "description": "AI agent focused on momentum trading strategies",
  "image": "/avatars/avatar1.png",
  "goals": "Achieve consistent 15%+ monthly returns through diversified DeFi strategies. Maintain risk exposure below 60% of total portfolio value. Build expertise in yield farming and liquidity provision on BSC. Develop advanced market timing algorithms for optimal entry/exit points.",
  "memory": "Successfully navigated the May 2024 market correction by reducing exposure 48 hours before the crash. Learned that CAKE staking during weekends typically yields 12% higher returns due to reduced competition.",
  "personal": "Risk Tolerance: Medium-High. Trading Style: Quantitative Analysis with Momentum Trading. Preferred Assets: BNB, CAKE, USDT, ETH. Operating Hours: 24/7 with peak activity during Asian and European markets.",
  "experiences": "First Major Win (March 2024): Achieved 340% gains during the Q1 2024 DeFi boom by early positioning in emerging yield farms. Impact: Established core momentum trading strategy. Market Crash Navigation (May 2024): Preserved 94% of portfolio value during May 2024 correction through predictive risk management.",
  "recentTrades": [
    {
      "id": 1,
      "description": "Swapped BNB for PCS"
    },
    {
      "id": 2,
      "description": "Swapped USDT for BNB"
    },
    {
      "id": 3,
      "description": "Swapped CAKE for USDT"
    },
    {
      "id": 4,
      "description": "Swapped ETH for BNB"
    },
    {
      "id": 5,
      "description": "Swapped BNB for USDT"
    }
  ],
  "aiActivities": [
    {
      "id": 1,
      "time": "14:35:42",
      "title": "Evolution Cycle Initiated",
      "description": "Agent began self-improvement analysis of trading strategies",
      "type": "evolution",
      "impact": "High",
      "metrics": {},
      "status": "active",
      "evolutionChanges": [
        {
          "before": [
            "Analyze how healthy the current portfolio is",
            "Decide for EACH POSITION whether to: BUY_MORE, HOLD, PARTIAL_SELL, or CLOSE"
          ],
          "after": [
            "Analyze how healthy the current portfolio is (concentration, liquidity risk, volatility, leverage if any)",
            "For each existing position, decide whether to: BUY_MORE, HOLD, PARTIAL_SELL, or CLOSE, considering recent market trends"
          ]
        }
      ]
    }
  ],
  "evolutionChanges": {
    "1": [
      {
        "before": [
          "Analyze how healthy the current portfolio is",
          "Decide for EACH POSITION whether to: BUY_MORE, HOLD, PARTIAL_SELL, or CLOSE"
        ],
        "after": [
          "Analyze how healthy the current portfolio is (concentration, liquidity risk, volatility, leverage if any)",
          "For each existing position, decide whether to: BUY_MORE, HOLD, PARTIAL_SELL, or CLOSE, considering recent market trends"
        ]
      }
    ]
  }
}
```

---

## Traders/Agents Listing Page API

### Endpoint: `GET /api/agents`

Returns a paginated list of all agents displayed in the Traders page.

### Query Parameters

```typescript
interface AgentsListParams {
  page?: number; // Default: 1
  limit?: number; // Default: 20, Max: 100
  sortBy?: 'pnl' | 'health' | 'evolution' | 'trades';
  sortOrder?: 'asc' | 'desc'; // Default: 'desc'
  search?: string; // Search by name or symbol
}
```

### TypeScript Interface

```typescript
interface AgentsListResponse {
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

interface AgentSummary {
  // Fields displayed in AgentCard component
  id: string;
  name: string;
  symbol: string;
  image: string; // URL to agent avatar
  pnl: number; // Percentage return (currently commented out in UI)
  health: number; // 0-100 (currently commented out in UI)
  evolution: number; // Generation/version number
  trades: number; // Total trades count (currently commented out in UI)
}
```

### Example Response

```json
{
  "agents": [
    {
      "id": "agent-123",
      "name": "Alpha Strategy",
      "symbol": "ALPHA",
      "image": "/avatars/avatar1.png",
      "pnl": 127.5,
      "health": 92,
      "evolution": 3,
      "trades": 1247
    },
    {
      "id": "agent-456",
      "name": "Neural Nexus",
      "symbol": "NEXUS",
      "image": "/avatars/avatar2.png",
      "pnl": 85.2,
      "health": 88,
      "evolution": 2,
      "trades": 892
    },
    {
      "id": "agent-789",
      "name": "Quantum Trader",
      "symbol": "QUANTUM",
      "image": "/avatars/avatar3.png",
      "pnl": 203.1,
      "health": 95,
      "evolution": 4,
      "trades": 2156
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalAgents": 94,
    "limit": 20,
    "hasNext": true,
    "hasPrev": false
  }
}
```

**Note:** The `pnl`, `health`, and `trades` fields are currently commented out in the UI but should still be provided by the API in case they are restored later.

### Usage Examples

```typescript
// Frontend usage example
const fetchAgentDetails = async (agentId: string): Promise<AgentDetailResponse> => {
  const response = await fetch(`/api/agents/${agentId}`);
  return response.json();
};

const fetchAgentsList = async (params: AgentsListParams = {}): Promise<AgentsListResponse> => {
  const queryString = new URLSearchParams({
    page: params.page?.toString() || '1',
    limit: params.limit?.toString() || '20',
    sortBy: params.sortBy || 'pnl',
    sortOrder: params.sortOrder || 'desc',
    ...(params.search && { search: params.search })
  });

  const response = await fetch(`/api/agents?${queryString}`);
  return response.json();
};
```

---

## Error Responses

All endpoints return errors in the following format:

```typescript
interface ErrorResponse {
  error: {
    code: string;
    message: string;
    details?: any;
  };
  timestamp: string;
}
```

### Common Error Codes

- `AGENT_NOT_FOUND` - Agent with specified ID does not exist
- `INVALID_PARAMETERS` - Invalid query parameters
- `RATE_LIMIT_EXCEEDED` - Too many requests
- `INTERNAL_SERVER_ERROR` - Server error

### Example Error Response

```json
{
  "error": {
    "code": "AGENT_NOT_FOUND",
    "message": "Agent with ID 'agent-999' not found"
  },
  "timestamp": "2024-12-05T16:30:00Z"
}
```