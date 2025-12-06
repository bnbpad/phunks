import axios from "axios";
import nconf from "nconf";
import { AIDecisions } from "../../database/AIDecison";
import { getAproPrices } from "../../scripts/apro";

export interface MarketAnalysis {
  token: string;
  price: number;
  volume24h: number;
  marketCap: number;
  priceChange24h: number;
  volatility: number;
  liquidity: number;
  sentiment: "bullish" | "bearish" | "neutral";
  technicalIndicators: {
    rsi: number;
    macd: number;
    movingAverage20: number;
    movingAverage50: number;
  };
}

export interface TradingDecision {
  action: "BUY" | "SELL" | "HOLD";
  confidence: number;
  reasoning: string;
  riskLevel: "LOW" | "MEDIUM" | "HIGH";
  positionSize: number;
  stopLoss?: number;
  takeProfit?: number;
  marketConditions: string[];
  selectedToken?: MarketAnalysis;
}

export interface AIPrompt {
  market_analysis: string;
  risk_assessment: string;
  position_sizing: string;
}

export interface Balance {
  accountAlias: string;
  asset: string;
  balance: string;
  crossWalletBalance: string;
  crossUnPnl: string;
  availableBalance: string;
  maxWithdrawAmount: string;
  marginAvailable: boolean;
  updateTime: number;
}

export interface UserPosition {
  protocolName?: string;
  chain?: string;
  token: string;
  amount: number;
  usdValue: number;
  entryPrice?: number;
  pnlUsd?: number;
  positionType?: "SPOT" | "FARM" | "STAKED" | "BORROW" | "LEND" | "PERP";
}

export interface PortfolioDecisionPosition {
  token: string;
  current_usd_value: number;
  action: "BUY_MORE" | "HOLD" | "PARTIAL_SELL" | "CLOSE";
  size_change_usd: number;
  target_allocation_pct: number;
  stop_loss: number | null;
  take_profit: number | null;
  reasoning: string;
}

export interface PortfolioDecisionNewEntry {
  token: string;
  action: "BUY";
  entry_size_usd: number;
  stop_loss: number | null;
  take_profit: number | null;
  reasoning: string;
}

export interface PortfolioDecisionResult {
  portfolio_summary: {
    overall_risk_level: "LOW" | "MEDIUM" | "HIGH";
    overall_comment: string;
    suggested_leverage: number | null;
  };
  per_position_decisions: PortfolioDecisionPosition[];
  new_entries: PortfolioDecisionNewEntry[];
}

export interface AIDecisionResult {
  decision: PortfolioDecisionResult;
  prompt: string;
  tasks: string[];
}

export class OllamaDecisionEngine {
  private ollamaHost: string;
  private model: string;
  private prompts: AIPrompt;

  constructor(apiKey?: string, model?: string, prompts?: AIPrompt) {
    this.ollamaHost = nconf.get("OLLAMA_HOST") || "http://localhost:11434";
    this.model = model || nconf.get("OLLAMA_MODEL") || "deepseek-r1:8b";
    this.prompts = prompts || {
      market_analysis:
        "Analyze the current market conditions for {token} and provide a trading recommendation. Consider: 1) Technical indicators, 2) Market sentiment, 3) Volume analysis, 4) Risk assessment. Respond with: BUY, SELL, or HOLD and provide reasoning.",
      risk_assessment:
        "Assess the risk level for trading {token} at current market conditions. Consider volatility, liquidity, and market trends. Rate risk as: LOW, MEDIUM, or HIGH with detailed reasoning.",
      position_sizing:
        "Determine the optimal position size for {token} based on current market conditions and risk tolerance. Consider account balance, volatility, and market sentiment.",
    };
  }

  async getPortfolioDecision(
    marketDataArray: MarketAnalysis[],
    balances: Balance[],
    userPositions: UserPosition[],
    riskTolerance: "LOW" | "MEDIUM" | "HIGH",
    agentName: string,
    currentTasks: string[]
  ): Promise<AIDecisionResult> {
    let tasks: string[] = currentTasks;
    const previousDecision = await AIDecisions.find({ agentId: agentName })
      .sort({ createdAt: -1 })
      .limit(5);
    const previousDecisionArray = previousDecision.map((decision) => ({
      task: Array.isArray(decision.tasks) ? decision.tasks : [decision.tasks],
      decision: decision.decision,
    }));

    if (previousDecisionArray.length > 0) {
      const previousDecisionList = previousDecisionArray.map(
        (decision, index) =>
          `${index + 1}. ${JSON.stringify(decision.decision)}`
      );
      const previousTaskList = previousDecisionArray.map((decision, index) =>
        decision.task.join("\n")
      );
      const newTaskPrompt = [
        "You are an expert in generating evolving portfolio-management task lists.",
        "",
        "INPUT:",
        `1. Previous decision JSON: ${previousDecisionList}`,
        `2. Previous task list: ${previousTaskList}`,
        "3. Long-term goals:",
        "- Maximize long-term risk-adjusted returns",
        "- Avoid large drawdowns",
        `- Respect user risk tolerance: ${riskTolerance}`,
        "",
        "INSTRUCTIONS:",
        "- Read the previous decision to understand what actions were taken (e.g., HOLD, BUY, diversification attempts, risk reductions, etc.)",
        "- Read the previous task list to understand the prior evaluation framework",
        "- Now generate a NEW set of tasks for the next evaluation cycle",
        "- CRITICAL: The output must contain MAXIMUM 6 tasks (no more than 6)",
        "- CRITICAL: Approximately 50% of the previous tasks should be KEPT (unchanged or slightly modified) to show continuity and evolution",
        "- CRITICAL: Approximately 50% of the tasks should be NEW or significantly changed to reflect new priorities and lessons learned",
        "- The tasks must be similar in style and structure to the historical example tasks the user provided",
        "- The tasks must evolve *logically* from the previous decision and previous tasks, reflecting:",
        "  • New priorities",
        "  • Follow-ups",
        "  • Adjusted focus",
        "  • Lessons from prior actions",
        "- The tasks must remain high-level but actionable, suitable for a recurring portfolio-review loop",
        "- Do NOT output decisions, JSON, actions, or portfolio commentary",
        "- Output ONLY the new task list (no explanations, no intro text)",
        "",
        "OUTPUT FORMAT:",
        "Return ONLY a task list (one task per line, up to 6 tasks maximum), written clearly and concisely. Do NOT number the tasks.",
        "",
        "Example structure your output must follow (format only, content must be newly generated):",
        "Analyze the updated portfolio structure…",
        "Reevaluate existing position allocations…",
        "Assess new diversification opportunities…",
        "Review risk levels and adjust stop-loss strategy…",
        "Recommend new entries only if…",
        "Monitor market conditions for…",
        "",
        "Only output the new task list (maximum 6 tasks, with ~50% kept from previous and ~50% new/changed).",
      ].join("\n");

      const taskString = await this.callOpenAI(newTaskPrompt);
      tasks = this.parseTaskList(taskString);
    }
    console.log("tasks", tasks);

    const prompt = await this.buildUserPortfolioDecisionPrompt(
      marketDataArray,
      balances,
      userPositions,
      riskTolerance,
      tasks.join("\n")
    );
    const response = await this.callOpenAI(prompt);
    const parsedPrompt = prompt.replace(/\n/g, "").replace(/\+/g, "");
    try {
      const parsed = JSON.parse(response);
      return {
        decision: parsed,
        prompt: parsedPrompt,
        tasks: tasks,
      } as AIDecisionResult;
    } catch (error) {
      console.error(
        "Failed to parse portfolio decision JSON from OpenAI:",
        error,
        response
      );

      return {
        decision: {
          portfolio_summary: {
            overall_risk_level: "MEDIUM",
            overall_comment:
              "Unable to parse AI portfolio decision JSON. Returning safe-neutral portfolio summary.",
            suggested_leverage: null,
          },
          per_position_decisions: [],
          new_entries: [],
        },
        prompt: parsedPrompt,
        tasks: tasks,
      };
    }
  }

  private parseTaskList(taskString: string): string[] {
    // Parse task list (handles both numbered and unnumbered formats)
    // Handles numbered formats: "1.", "1)", "1 -", etc.
    // Also handles unnumbered formats: plain text lines
    const lines = taskString
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    const tasks: string[] = [];
    for (const line of lines) {
      // Match numbered items: "1.", "1)", "1.", "1 -", etc.
      const match = line.match(/^\d+[.)\-\s]+(.+)$/);
      if (match) {
        tasks.push(match[1].trim());
      } else {
        // If no numbered format found, treat the line as a task
        tasks.push(line);
      }
    }

    return tasks.length > 0 ? tasks : [taskString];
  }

  private async callOpenAI(prompt: string): Promise<string> {
    try {
      const response = await axios.post(`${this.ollamaHost}/api/generate`, {
        model: this.model,
        prompt,
        stream: false,
      });
      const result: string = response.data?.response || "";
      return result.trim();
    } catch (error: any) {
      console.error("Ollama API error:", error);
      throw new Error(
        `Ollama API call failed: ${error.message || String(error)}`
      );
    }
  }

  private async buildUserPortfolioDecisionPrompt(
    marketDataArray: MarketAnalysis[],
    balances: Balance[],
    userPositions: UserPosition[],
    riskTolerance: "LOW" | "MEDIUM" | "HIGH",
    newTask: string
  ): Promise<string> {
    const usdtBalance = this.getAssetAvailableBalance(balances, "USDT");

    // Fetch current prices for major cryptocurrencies
    const aproPrices = await getAproPrices();
    const majorTokenPrices = [
      aproPrices.bitcoin
        ? `- Bitcoin (BTC): $${aproPrices.bitcoin.price.toFixed(2)}`
        : null,
      aproPrices.ethereum
        ? `- Ethereum (ETH): $${aproPrices.ethereum.price.toFixed(2)}`
        : null,
      aproPrices.bnb ? `- BNB: $${aproPrices.bnb.price.toFixed(2)}` : null,
    ]
      .filter(Boolean)
      .join("\n");
    const balancesTable = balances
      .map((b) => {
        const amount = this.parseBalanceValue(b.availableBalance);
        return `- ${b.asset}: ${amount} (available), crossWalletBalance: ${b.crossWalletBalance}`;
      })
      .join("\n");

    const positionsTable = userPositions.length
      ? userPositions
          .map((p) =>
            [
              `- Token: ${p.token}`,
              `  chain: ${p.chain || "n/a"}`,
              `  protocol: ${p.protocolName || "n/a"}`,
              `  type: ${p.positionType || "SPOT"}`,
              `  amount: ${p.amount}`,
              `  usdValue: $${p.usdValue.toFixed(2)}`,
              p.entryPrice != null ? `  entryPrice: $${p.entryPrice}` : null,
              p.pnlUsd != null ? `  pnlUsd: $${p.pnlUsd.toFixed(2)}` : null,
            ]
              .filter(Boolean)
              .join("\n")
          )
          .join("\n")
      : "No open positions";

    const marketDataTable = marketDataArray
      .map((d) => {
        return [
          `- Token: ${d.token}`,
          `  Price: $${d.price}`,
          `  24h Volume: $${d.volume24h.toLocaleString()}`,
          `  Market Cap: $${d.marketCap.toLocaleString()}`,
          `  24h Change: ${d.priceChange24h}%`,
          `  Volatility: ${d.volatility}%`,
          `  Liquidity: $${d.liquidity.toLocaleString()}`,
          `  Sentiment: ${d.sentiment}`,
          `  RSI: ${d.technicalIndicators.rsi}`,
          `  MACD: ${d.technicalIndicators.macd}`,
          `  MA20: $${d.technicalIndicators.movingAverage20}`,
          `  MA50: $${d.technicalIndicators.movingAverage50}`,
        ].join("\n");
      })
      .join("\n");

    const baseTemplate = `You are an expert crypto portfolio manager and risk analyst.

Your goals:
1. Maximize long-term risk-adjusted returns.
2. Avoid large drawdowns and manage downside risk.
3. Respect the user's risk tolerance: ${riskTolerance}.

--- CURRENT MAJOR CRYPTOCURRENCY PRICES ---
${majorTokenPrices || "Unable to fetch current prices"}

--- USER BALANCES (SPOT/MARGIN/FUTURES) ---
USDT balance: ${usdtBalance}
Other balances:
${balancesTable}

--- USER OPEN POSITIONS / PORTFOLIO ---
${positionsTable}

--- CURRENT MARKET DATA FOR RELEVANT TOKENS ---
${marketDataTable}

TASK:
${newTask}

OUTPUT FORMAT (STRICT, for saving into database):
Return a single JSON object with this shape, and nothing else:

{
  "portfolio_summary": {
    "overall_risk_level": "LOW" | "MEDIUM" | "HIGH",
    "overall_comment": "short human-readable summary (max 2 sentences)",
    "suggested_leverage": number | null
  },
  "per_position_decisions": [
    {
      "token": "e.g. BTC",
      "current_usd_value": number,
      "action": "BUY_MORE" | "HOLD" | "PARTIAL_SELL" | "CLOSE",
      "size_change_usd": number,
      "target_allocation_pct": number,
      "stop_loss": number | null,
      "take_profit": number | null,
      "reasoning": "max 3 short sentences"
    }
  ],
  "new_entries": [
    {
      "token": "e.g. ETH",
      "action": "BUY",
      "entry_size_usd": number,
      "stop_loss": number | null,
      "take_profit": number | null,
      "reasoning": "max 3 short sentences"
    }
  ]
}

Constraints:
- Always keep JSON valid.
- Do not repeat the instructions in the output.
- If you are unsure, choose safer actions and smaller position sizes.`;

    return baseTemplate;
  }

  private parseBalanceValue(value: string | number | undefined): number {
    if (typeof value === "number") {
      return Number.isFinite(value) ? value : 0;
    }
    if (typeof value === "string") {
      const parsed = parseFloat(value);
      return Number.isFinite(parsed) ? parsed : 0;
    }
    return 0;
  }

  private getAssetAvailableBalance(balance: Balance[], asset = "USDT"): number {
    if (!Array.isArray(balance) || balance.length === 0) {
      return 0;
    }

    const entry = balance.find(
      (b) => b.asset?.toUpperCase() === asset.toUpperCase()
    );

    return entry ? this.parseBalanceValue(entry.availableBalance) : 0;
  }
}
