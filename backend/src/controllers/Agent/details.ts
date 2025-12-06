import { AIDecisions } from "../../database/AIDecison";
import { AIThesisModel } from "../../database/aiThesis";
import { Tokens } from "../../database/token";
import { Trades } from "../../database/action";
// import { EvolutionChange } from "./decision";
import { NotFoundError, BadRequestError } from "../../errors";

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
    [activityId: number]: any[];
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
  type: "evolution" | "learning" | "info" | "trade" | "success" | "warning";
  impact: "High" | "Medium" | "Low";
  metrics: Record<string, string>; // Key-value pairs for metrics (can be empty {})
  status: "active" | "completed" | "monitoring" | "executed" | "processed";
  evolutionChanges?: any[]; // Only for evolution type activities
}

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

export const getAgentsDetail = async (
  tokenAddress: string
): Promise<AgentDetailResponse> => {
  const normalizedAddress = tokenAddress.toLowerCase();

  // Fetch all required data in parallel
  const [agent, aiThesis, decisions, trades] = await Promise.all([
    Tokens.findOne({ "basicDetails.address": normalizedAddress }).lean(),
    AIThesisModel.findOne({ tokenAddress: normalizedAddress }).lean(),
    AIDecisions.find({ agentId: normalizedAddress })
      .sort({ createdAt: -1 })
      .lean(),
    Trades.find({ tokenAddress: normalizedAddress })
      .sort({ createdAt: -1 })
      .limit(10)
      .lean(),
  ]);

  if (!agent) {
    throw new NotFoundError("Agent not found");
  }

  // Map recent trades
  const recentTrades: Trade[] = trades.map((trade, index) => ({
    id: index + 1,
    description: `${trade.action} ${trade.symbol} - ${trade.amount} @ $${trade.price.toFixed(4)}`,
  }));

  // Create AI activities from decisions
  const aiActivities: AIActivity[] = [];
  const evolutionChanges: { [activityId: number]: any[] } = {};

  decisions.forEach((decision: any, index) => {
    const decisionDate = decision.createdAt
      ? new Date(decision.createdAt)
      : new Date();
    const time = decisionDate.toTimeString().split(" ")[0]; // HH:mm:ss format

    // Determine if this is an evolution (has tasks that changed)
    const isEvolution =
      index > 0 &&
      decisions[index - 1]?.tasks &&
      decision.tasks &&
      JSON.stringify(decisions[index - 1].tasks) !==
        JSON.stringify(decision.tasks);

    const activityId = index + 1;
    const riskLevel =
      decision.decision?.decision?.portfolio_summary?.overall_risk_level || "";
    const activity: AIActivity = {
      id: activityId,
      time,
      title: isEvolution ? "AI Evolution" : "Intelligent Decision Made",
      description: isEvolution
        ? "Agent has learned to trade more effectively based on market conditions."
        : "Agent has made a decision to trade based on it's own intelligence.",
      type: isEvolution ? "evolution" : "info",
      impact: "Medium" as const,
      metrics: {
        riskLevel: riskLevel,
        leverage:
          decision.decision?.decision?.portfolio_summary?.suggested_leverage?.toString() ||
          "",
      },
      status: "completed" as const,
    };

    // If evolution, add evolution changes
    if (isEvolution && index > 0) {
      const evolutionChange: any = {
        before: decisions[index - 1].tasks || [],
        after: decision.tasks || [],
      };
      activity.evolutionChanges = [evolutionChange];
      evolutionChanges[activityId] = [evolutionChange];
    }

    aiActivities.push(activity);
  });

  // Calculate generation based on number of evolutions (or default to 1)
  const generation = Math.max(1, Math.floor(decisions.length / 3) + 1);

  // Build response
  const response: AgentDetailResponse = {
    name: agent.basicDetails?.name || "Unknown Agent",
    symbol: agent.basicDetails?.symbol || "UNK",
    generation: 0,
    description: agent.basicDetails?.desc || "",
    image: agent.basicDetails?.image || "",

    goals: aiThesis?.goals || "",
    memory: aiThesis?.memory || "",
    personal: aiThesis?.persona || "",
    experiences: aiThesis?.experience || "",

    recentTrades,
    aiActivities,
    evolutionChanges,
  };

  return response;
};

export const getAllAgents = async (
  chainId?: string,
  limit: number = 20,
  page: number = 1
): Promise<AgentsListResponse> => {
  const pageNumber = Math.max(1, page);
  const limitNumber = Math.min(100, Math.max(1, limit));
  const skip = (pageNumber - 1) * limitNumber;

  if (limitNumber > 100) {
    throw new BadRequestError("Limit should be less than or equal to 100");
  }

  // Build query
  const query: any = {};
  if (chainId) {
    query["basicDetails.chainId"] = Number(chainId);
  }

  // Get total count and paginated tokens
  const [totalAgents, tokens] = await Promise.all([
    Tokens.countDocuments(query),
    Tokens.find(query)
      .select("basicDetails")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNumber)
      .lean(),
  ]);

  // Get all token addresses for batch queries
  const tokenAddresses = tokens
    .map((token) => token.basicDetails?.address?.toLowerCase())
    .filter(Boolean) as string[];

  if (tokenAddresses.length === 0) {
    return {
      agents: [],
      pagination: {
        currentPage: pageNumber,
        totalPages: Math.ceil(totalAgents / limitNumber),
        totalAgents,
        limit: limitNumber,
        hasNext: skip + limitNumber < totalAgents,
        hasPrev: pageNumber > 1,
      },
    };
  }

  // Fetch trades and decisions for all agents in parallel
  const [tradesByAgent, decisionsByAgent] = await Promise.all([
    Trades.aggregate([
      {
        $match: {
          tokenAddress: { $in: tokenAddresses },
          status: "completed",
        },
      },
      {
        $group: {
          _id: "$tokenAddress",
          trades: { $push: "$$ROOT" },
          count: { $sum: 1 },
        },
      },
    ]),
    AIDecisions.aggregate([
      {
        $match: {
          agentId: { $in: tokenAddresses },
        },
      },
      {
        $group: {
          _id: "$agentId",
          count: { $sum: 1 },
          decisions: { $push: "$$ROOT" },
        },
      },
    ]),
  ]);

  // Create maps for quick lookup
  const tradesMap = new Map(
    tradesByAgent.map((item) => [item._id.toLowerCase(), item])
  );
  const decisionsMap = new Map(
    decisionsByAgent.map((item) => [item._id.toLowerCase(), item])
  );

  // Calculate agent summaries
  const agents: AgentSummary[] = tokens.map((token) => {
    const tokenAddress = token.basicDetails?.address?.toLowerCase() || "";
    const trades = tradesMap.get(tokenAddress);
    const decisions = decisionsMap.get(tokenAddress);

    const tradeList = (trades?.trades || []).sort((a: any, b: any) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateA - dateB;
    });
    const tradesCount = trades?.count || 0;

    // Calculate PnL from completed trades
    // Simple calculation: sum of (sell price - buy price) for matched trades
    let totalPnL = 0;
    const buyTrades: Array<{ price: number; amount: number }> = [];

    tradeList.forEach((trade: any) => {
      if (trade.action === "BUY") {
        buyTrades.push({ price: trade.price, amount: trade.amount });
      } else if (trade.action === "SELL" && buyTrades.length > 0) {
        const buyTrade = buyTrades.shift();
        if (buyTrade) {
          const profit = (trade.price - buyTrade.price) / buyTrade.price;
          totalPnL += profit * 100; // Convert to percentage
        }
      }
    });

    // Calculate health score (0-100)
    // Based on: trade success rate, recent performance, and decision quality
    let health = 50; // Default health
    if (tradesCount > 0) {
      const successfulTrades = tradeList.filter(
        (t: any) => t.action === "SELL" && t.confidence > 70
      ).length;
      const successRate = (successfulTrades / tradesCount) * 100;
      health = Math.min(
        100,
        Math.max(0, successRate + (totalPnL > 0 ? 20 : -10))
      );
    }

    // Calculate evolution (generation number)
    const evolution = decisions
      ? Math.max(1, Math.floor(decisions.count / 3) + 1)
      : 1;

    return {
      id: tokenAddress,
      name: token.basicDetails?.name || "Unknown Agent",
      symbol: token.basicDetails?.symbol || "UNK",
      image: token.basicDetails?.image || "",
      pnl: Number(totalPnL.toFixed(2)),
      health: Math.round(health),
      evolution: 0,
      trades: tradesCount,
    };
  });

  const totalPages = Math.ceil(totalAgents / limitNumber);

  return {
    agents,
    pagination: {
      currentPage: pageNumber,
      totalPages,
      totalAgents,
      limit: limitNumber,
      hasNext: skip + limitNumber < totalAgents,
      hasPrev: pageNumber > 1,
    },
  };
};
