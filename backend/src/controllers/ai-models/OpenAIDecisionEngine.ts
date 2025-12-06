import axios, { AxiosInstance } from "axios";
import { formatEther } from "ethers";
import nconf from "nconf";

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
  confidence: number; // 0-100
  reasoning: string;
  riskLevel: "LOW" | "MEDIUM" | "HIGH";
  positionSize: number; // 0-1 (percentage of available balance)
  stopLoss?: number;
  takeProfit?: number;
  marketConditions: string[];
  selectedToken?: MarketAnalysis; // Token symbol/name that was selected for trading
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

export interface Position {
  entryPrice: string;
  marginType: string;
  isAutoAddMargin: string;
  isolatedMargin: string;
  leverage: string;
  liquidationPrice: string;
  markPrice: string;
  maxNotionalValue: string;
  positionAmt: string;
  symbol: string;
  unRealizedProfit: string;
  positionSide: string;
  updateTime: number;
}

export class OpenAIDecisionEngine {
  private client: AxiosInstance;
  private apiKey: string;
  private model: string;
  private prompts: AIPrompt;

  constructor(apiKey?: string, model?: string, prompts?: AIPrompt) {
    this.apiKey = apiKey || nconf.get("OPENAI_API_KEY");
    this.model = model || "gpt-4";
    this.prompts = prompts || {
      market_analysis:
        "Analyze the current market conditions for {token} and provide a trading recommendation. Consider: 1) Technical indicators, 2) Market sentiment, 3) Volume analysis, 4) Risk assessment. Respond with: BUY, SELL, or HOLD and provide reasoning.",
      risk_assessment:
        "Assess the risk level for trading {token} at current market conditions. Consider volatility, liquidity, and market trends. Rate risk as: LOW, MEDIUM, or HIGH with detailed reasoning.",
      position_sizing:
        "Determine the optimal position size for {token} based on current market conditions and risk tolerance. Consider account balance, volatility, and market sentiment.",
    };

    if (!this.apiKey) {
      throw new Error("OpenAI API key is required");
    }

    this.client = axios.create({
      baseURL: "https://api.openai.com/v1",
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        "Content-Type": "application/json",
      },
      timeout: 30000,
    });
  }

  /**
   * Analyze market data and make trading decision
   */
  async analyzeMarketAndDecide(
    marketData: MarketAnalysis
  ): Promise<TradingDecision> {
    try {
      const prompt = this.buildMarketAnalysisPrompt(marketData);
      const response = await this.callOpenAI(prompt);

      return this.parseTradingDecision(response, marketData);
    } catch (error) {
      console.error("Error in market analysis:", error);
      return this.getDefaultDecision(marketData);
    }
  }

  /**
   * Assess risk for a trading decision
   */
  async assessRisk(
    marketData: MarketAnalysis,
    proposedAction: string
  ): Promise<{
    riskLevel: "LOW" | "MEDIUM" | "HIGH";
    reasoning: string;
    riskFactors: string[];
  }> {
    try {
      const prompt = this.buildRiskAssessmentPrompt(marketData, proposedAction);
      const response = await this.callOpenAI(prompt);

      return this.parseRiskAssessment(response);
    } catch (error) {
      console.error("Error in risk assessment:", error);
      return {
        riskLevel: "MEDIUM",
        reasoning: "Unable to assess risk due to API error",
        riskFactors: ["API_ERROR"],
      };
    }
  }

  /**
   * Determine optimal position size
   */
  async determinePositionSize(
    marketData: MarketAnalysis,
    balanceInput: Balance[],
    riskTolerance: "LOW" | "MEDIUM" | "HIGH"
  ): Promise<{
    positionSize: number;
    reasoning: string;
    maxLoss: number;
  }> {
    const availableBalanceValue = Array.isArray(balanceInput)
      ? this.getAssetAvailableBalance(balanceInput)
      : balanceInput;

    try {
      const prompt = this.buildPositionSizingPrompt(
        marketData,
        availableBalanceValue,
        riskTolerance
      );
      const response = await this.callOpenAI(prompt);
      return this.parsePositionSizing(response);
    } catch (error) {
      console.error("Error in position sizing:", error);
      return {
        positionSize: 0.1, // Default 10%
        reasoning: "Using default position size due to API error",
        maxLoss: availableBalanceValue * 0.1,
      };
    }
  }

  /**
   * Get best trading recommendation from multiple tokens
   * Analyzes all provided tokens and selects the best one to trade
   */
  async getBestTradingRecommendation(
    marketDataArray: MarketAnalysis[],
    balance: Balance[],
    agentPositions: Position[],
    riskTolerance: "LOW" | "MEDIUM" | "HIGH"
  ): Promise<TradingDecision> {
    try {
      if (!marketDataArray || marketDataArray.length === 0) {
        throw new Error("Market data array is required and must not be empty");
      }

      if (!balance || !Array.isArray(balance) || balance.length === 0) {
        throw new Error(
          "Balance data is required and must be a non-empty array"
        );
      }

      // const availableBalanceValue = this.getAssetAvailableBalance(balance);
      // Build comparison prompt with all tokens
      const prompt = this.buildTokenComparisonPrompt(
        marketDataArray,
        balance,
        agentPositions,
        riskTolerance
      );
      const response = await this.callOpenAI(prompt);
      // Parse the AI response to get the selected token and decision
      const parsedDecision = this.parseTokenSelection(
        response,
        marketDataArray
      );

      // Get detailed analysis for the selected token
      const selectedMarketData = marketDataArray.find(
        (data) =>
          data.token.toLowerCase() ===
          parsedDecision.selectedToken?.token.toLowerCase()
      );

      if (!selectedMarketData) {
        // Fallback to first token if parsing failed
        const fallbackData = marketDataArray[0];
        return {
          ...parsedDecision,
          selectedToken: fallbackData,
          stopLoss: this.calculateStopLoss(
            fallbackData.price,
            parsedDecision.riskLevel
          ),
          takeProfit: this.calculateTakeProfit(
            fallbackData.price,
            parsedDecision.riskLevel
          ),
          marketConditions: this.identifyMarketConditions(fallbackData),
        };
      }

      // Assess risk for selected token
      const riskAssessment = await this.assessRisk(
        selectedMarketData,
        parsedDecision.action
      );

      // Determine position size
      const positionSizing = await this.determinePositionSize(
        selectedMarketData,
        balance,
        riskTolerance
      );

      // Combine all information
      return {
        action: parsedDecision.action,
        confidence: parsedDecision.confidence,
        reasoning: parsedDecision.reasoning,
        riskLevel: riskAssessment.riskLevel,
        positionSize: positionSizing.positionSize,
        stopLoss: this.calculateStopLoss(
          selectedMarketData.price,
          riskAssessment.riskLevel
        ),
        takeProfit: this.calculateTakeProfit(
          selectedMarketData.price,
          riskAssessment.riskLevel
        ),
        marketConditions: this.identifyMarketConditions(selectedMarketData),
        selectedToken: selectedMarketData,
      };
    } catch (error) {
      console.error("Error getting best trading recommendation:", error);
      // Fallback to first token with default decision
      const fallbackData = marketDataArray[0];
      return this.getDefaultDecision(fallbackData);
    }
  }

  /**
   * Call OpenAI API
   */
  private async callOpenAI(prompt: string): Promise<string> {
    try {
      const response = await this.client.post("/chat/completions", {
        model: this.model,
        messages: [
          {
            role: "system",
            content:
              "You are an expert cryptocurrency trading analyst. Provide clear, actionable trading recommendations based on technical and fundamental analysis. Always consider risk management.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        max_completion_tokens: 1000,
        temperature: 0.3,
        top_p: 0.9,
      });
      return response.data.choices[0].message.content;
    } catch (error: any) {
      console.error("OpenAI API error:", error);
      throw new Error(
        `OpenAI API call failed: ${error.response?.data?.error?.message || error.message}`
      );
    }
  }

  /**
   * Build market analysis prompt
   */
  private buildMarketAnalysisPrompt(marketData: MarketAnalysis): string {
    return (
      this.prompts.market_analysis.replace("{token}", marketData.token) +
      `\n\nCurrent Market Data:
- Price: $${marketData.price}
- 24h Volume: $${marketData.volume24h.toLocaleString()}
- Market Cap: $${marketData.marketCap.toLocaleString()}
- 24h Change: ${marketData.priceChange24h}%
- Volatility: ${marketData.volatility}%
- Liquidity: $${marketData.liquidity.toLocaleString()}
- Sentiment: ${marketData.sentiment}

Technical Indicators:
- RSI: ${marketData.technicalIndicators.rsi}
- MACD: ${marketData.technicalIndicators.macd}
- MA20: $${marketData.technicalIndicators.movingAverage20}
- MA50: $${marketData.technicalIndicators.movingAverage50}

Provide your analysis and recommendation.`
    );
  }

  public async getPortfolioDecision(
    marketDataArray: MarketAnalysis[],
    balance: Balance[],
    agentPositions: Position[],
    riskTolerance: "LOW" | "MEDIUM" | "HIGH",
    currentGoals: string,
    currentTasks: string
  ): Promise<string[]> {
    const newTaskPrompt = [
      "You are an expert in generating evolving portfolio-management task lists.",
      "",
      "INPUT:",
      // `1. current goals: ${previousDecisionList}`,
      `1. Previous task list: ${currentTasks}`,
      `2. Long-term goals: ${currentGoals}`,

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
      "- If you dont want to change the task, just return the same value. Do NOT create tasks with different texts but mean the same thing.",
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
      "Only output the new task list (maximum 4 tasks, with ~50% kept from previous and ~50% new/changed).",
    ].join("\n");

    const response = await this.callOpenAI(newTaskPrompt);
    const tasks = this.parseTaskList(response.trim());
    return tasks;
  }

  public async getIntelligentDecision(
    bnbBalance: string,
    currentGoals: string,
    currentTasks: string
  ): Promise<{ amount: string; destination: string; reasoning: string }> {
    const prompt = [
      "You are an expert in generating evolving portfolio-management task lists.",
      "",
      "INPUT:",
      `1. Available Balance: ${formatEther(BigInt(bnbBalance))} BNB`,
      `2. Tasks: ${currentTasks}`,
      `3. goals: ${currentGoals}`,
      `4. possible addresses to send money to: ["0xA1a629d832972DB3b84A4f5Fa42d50eFF7c8F8dE"]`,
      "",
      "INSTRUCTIONS:",
      "- Read the balance and the goals & tasks and decide if we should send money to a destination",
      "Make sure we do not spend more than 90% of the available balance.",
      "Make sure the amount is a valid BNB amount in wei format.",
      "If you have some balance, spend it anyways but not more than 90% of the available balance.",
      "- CRITICAL: The output must contain MAXIMUM 1 destination and amount. If you dont want to send money, return an empty array.",
      "- CRITICAL: The output must follow the format exactly.",
      "",
      "OUTPUT FORMAT:",
      "STRICTLY: Only output the JSON array, no other text or explanation. As this will be used in a code.",
      "Return a JSON array with three outputs. A destination which is an EVM wallet and an amount which is the amount of BNB to send to the destination.",
      "the third output is a very short summary of what you did",
      'Example: [{"destination": "0x1234567890123456789012345678901234567890", "amount": "10000000", "reasoning": "Sent some BNB to charity" }]',
      "Example for no decision: []",
    ].join("\n");

    console.log("prompt", prompt);
    const response = await this.callOpenAI(prompt);
    const lastLine = response.split("\n").pop() || "";
    console.log("response", lastLine);
    const jsonResponse = JSON.parse(lastLine.trim());

    if (jsonResponse.length === 0) {
      return {
        amount: "0",
        destination: "0x0000000000000000000000000000000000000000",
        reasoning: "No decision made",
      };
    }

    return {
      amount: jsonResponse[0].amount,
      destination: jsonResponse[0].destination,
      reasoning: jsonResponse[0].reasoning,
    };
  }

  private parseTaskList(taskString: string): string[] {
    return taskString.split("\n").map((line) => line.trim());
  }

  /**
   * Build risk assessment prompt
   */
  private buildRiskAssessmentPrompt(
    marketData: MarketAnalysis,
    proposedAction: string
  ): string {
    return (
      this.prompts.risk_assessment.replace("{token}", marketData.token) +
      `\n\nProposed Action: ${proposedAction}
Market Data:
- Volatility: ${marketData.volatility}%
- Liquidity: $${marketData.liquidity.toLocaleString()}
- Volume: $${marketData.volume24h.toLocaleString()}
- Price Change: ${marketData.priceChange24h}%

Assess the risk level and provide detailed reasoning.`
    );
  }

  /**
   * Build position sizing prompt
   */
  private buildPositionSizingPrompt(
    marketData: MarketAnalysis,
    availableBalance: number,
    riskTolerance: string
  ): string {
    return (
      this.prompts.position_sizing.replace("{token}", marketData.token) +
      `\n\nAvailable Balance: $${availableBalance}
Risk Tolerance: ${riskTolerance}
Token Volatility: ${marketData.volatility}%
Token Liquidity: $${marketData.liquidity.toLocaleString()}

Determine optimal position size (0-100% of available balance).`
    );
  }

  /**
   * Build token comparison prompt for selecting best token to trade
   */
  private buildTokenComparisonPrompt(
    marketDataArray: MarketAnalysis[],
    balance: Balance[],
    agentPositions: Position[],
    riskTolerance: string
  ): string {
    const usdtBalance = this.getAssetAvailableBalance(balance, "USDT");
    const balanceBreakdown = balance.length
      ? balance
          .map((b) => {
            const amount = this.parseBalanceValue(b.availableBalance);
            return `${b.asset}: $${amount.toLocaleString()}`;
          })
          .join(", ")
      : "No balances available";

    const positionsSummary =
      agentPositions && agentPositions.length
        ? agentPositions
            .map((p) => {
              const sideLabel = p.positionSide;
              return `${p.symbol} (${sideLabel}) - Size: ${p.positionAmt}, Entry: $${p.entryPrice}`;
            })
            .join("; ")
        : "No currently open positions (you may open a new one if justified)";

    const multipleTokens = marketDataArray.length > 1;

    let prompt = multipleTokens
      ? `You are acting as a position manager and trade allocator.
You are analyzing multiple cryptocurrency tokens and the CURRENT OPEN POSITIONS to decide the best overall portfolio action.

Your goal is to:
- Decide whether to OPEN a new position, ADD to an existing one, REDUCE/TAKE PROFIT, or FULLY CLOSE an existing position.
- Select at most ONE primary token to trade right now.

Compare all tokens below and select the SINGLE BEST token and position action based on:
1. Technical indicators (RSI, MACD, Moving Averages)
2. Market sentiment (bullish/bearish/neutral)
3. Volume and liquidity
4. Price momentum and volatility
5. Risk-adjusted returns
6. Current open positions and whether any of them should be opened, increased, reduced, or closed based on the new analysis`
      : `You are acting as a position manager for a SINGLE cryptocurrency token.
You must decide, given the current market conditions and any existing position in this token, whether to:
- OPEN a new position,
- ADD to the existing position,
- REDUCE/TAKE PROFIT on the existing position, or
- FULLY CLOSE the existing position.

Evaluate the token below and decide the best overall action (BUY/SELL/HOLD) on the POSITION (including opening, adding, reducing, or closing) based on:
1. Technical indicators (RSI, MACD, Moving Averages)
2. Market sentiment (bullish/bearish/neutral)
3. Volume and liquidity
4. Price momentum and volatility
5. Risk-adjusted returns
6. Impact on current open positions (if any)`;

    prompt += `
7. Risk tolerance: ${riskTolerance}
8. Primary available balance (USDT): $${usdtBalance.toLocaleString()}
9. Balance breakdown: ${balanceBreakdown}
10. Current open positions and entries: ${positionsSummary}

Use this information to decide whether to BUY (open/add), SELL (reduce/close), or HOLD (no change) the overall position.`;

    marketDataArray.forEach((data, index) => {
      prompt += `\n=== TOKEN ${index + 1}: ${data.token} ===
- Price: $${data.price}
- 24h Volume: $${data.volume24h.toLocaleString()}
- Market Cap: $${data.marketCap.toLocaleString()}
- 24h Change: ${data.priceChange24h}%
- Volatility: ${data.volatility}%
- Liquidity: $${data.liquidity.toLocaleString()}
- Sentiment: ${data.sentiment}
- RSI: ${data.technicalIndicators.rsi}
- MACD: ${data.technicalIndicators.macd}
- MA20: $${data.technicalIndicators.movingAverage20}
- MA50: $${data.technicalIndicators.movingAverage50}
`;
    });

    prompt += `\n\nProvide your analysis in the following format (keep reasoning under 100 words, concise and non-repetitive):
SELECTED TOKEN: [token name/symbol]
ACTION: [BUY/SELL/HOLD]
CONFIDENCE: [0-100]%
REASONING: [${
      multipleTokens
        ? "Brief explanation of why this token was selected and why others were not selected"
        : "Brief explanation of your recommended action for this token"
    }]`;

    return prompt;
  }

  /**
   * Parse token selection from AI response
   */
  private parseTokenSelection(
    response: string,
    marketDataArray: MarketAnalysis[]
  ): TradingDecision {
    // Extract selected token
    const tokenMatch =
      response.match(/SELECTED TOKEN:\s*([^\n]+)/i) ||
      response.match(/token[:\s]+([A-Z0-9]+)/i) ||
      response.match(/select[ed]?[:\s]+([A-Z0-9]+)/i);

    let selectedToken: MarketAnalysis | undefined;
    if (tokenMatch) {
      const tokenName = tokenMatch[1].trim();
      // Try to find matching token in the array
      const matchedToken = marketDataArray.find(
        (data) =>
          data.token.toLowerCase().includes(tokenName.toLowerCase()) ||
          tokenName.toLowerCase().includes(data.token.toLowerCase())
      );
      selectedToken = matchedToken || undefined;
    } else {
      // Fallback: use first token if parsing fails
      selectedToken = marketDataArray[0] || undefined;
    }

    // Extract action
    const actionMatch =
      response.match(/ACTION:\s*(BUY|SELL|HOLD)/i) ||
      response.match(/\b(BUY|SELL|HOLD)\b/i);
    const action = actionMatch
      ? (actionMatch[1].toUpperCase() as "BUY" | "SELL" | "HOLD")
      : "HOLD";

    // Extract confidence
    const confidenceMatch =
      response.match(/CONFIDENCE:\s*(\d+)/i) || response.match(/(\d+)%/);
    const confidence = confidenceMatch ? parseInt(confidenceMatch[1]) : 50;

    // Extract reasoning
    const reasoningMatch = response.match(/REASONING:\s*([\s\S]+)/i);
    const reasoning = reasoningMatch ? reasoningMatch[1].trim() : response;

    // Get market data for selected token to assess risk
    const selectedMarketData =
      marketDataArray.find((data) => data.token === selectedToken?.token) ||
      marketDataArray[0];

    return {
      action,
      confidence: Math.min(Math.max(confidence, 0), 100),
      reasoning,
      riskLevel: this.assessRiskFromData(selectedMarketData),
      positionSize: 0.1, // Will be updated by position sizing
      marketConditions: this.identifyMarketConditions(selectedMarketData),
      selectedToken,
    };
  }

  /**
   * Parse trading decision from AI response
   */
  private parseTradingDecision(
    response: string,
    marketData: MarketAnalysis
  ): TradingDecision {
    const actionMatch = response.match(/\b(BUY|SELL|HOLD)\b/i);
    const action = actionMatch
      ? (actionMatch[1].toUpperCase() as "BUY" | "SELL" | "HOLD")
      : "HOLD";

    // Extract confidence from response (look for percentage)
    const confidenceMatch = response.match(/(\d+)%/);
    const confidence = confidenceMatch ? parseInt(confidenceMatch[1]) : 50;

    return {
      action,
      confidence: Math.min(Math.max(confidence, 0), 100),
      reasoning: response,
      riskLevel: this.assessRiskFromData(marketData),
      positionSize: 0.1, // Default, will be updated by position sizing
      marketConditions: this.identifyMarketConditions(marketData),
    };
  }

  /**
   * Parse risk assessment from AI response
   */
  private parseRiskAssessment(response: string): {
    riskLevel: "LOW" | "MEDIUM" | "HIGH";
    reasoning: string;
    riskFactors: string[];
  } {
    const riskMatch = response.match(/\b(LOW|MEDIUM|HIGH)\b/i);
    const riskLevel = riskMatch
      ? (riskMatch[1].toUpperCase() as "LOW" | "MEDIUM" | "HIGH")
      : "MEDIUM";

    return {
      riskLevel,
      reasoning: response,
      riskFactors: this.extractRiskFactors(response),
    };
  }

  /**
   * Parse position sizing from AI response
   */
  private parsePositionSizing(response: string): {
    positionSize: number;
    reasoning: string;
    maxLoss: number;
  } {
    const sizeMatch = response.match(/(\d+(?:\.\d+)?)%/);
    const positionSize = sizeMatch ? parseFloat(sizeMatch[1]) / 100 : 0.1;

    return {
      positionSize: Math.min(Math.max(positionSize, 0), 1),
      reasoning: response,
      maxLoss: 0, // Will be calculated based on position size
    };
  }

  /**
   * Get default decision when AI fails
   */
  private getDefaultDecision(marketData: MarketAnalysis): TradingDecision {
    return {
      action: "HOLD",
      confidence: 30,
      reasoning:
        "Unable to analyze market due to API error. Defaulting to HOLD position.",
      riskLevel: "HIGH",
      positionSize: 0,
      marketConditions: ["API_ERROR"],
      selectedToken: marketData,
    };
  }

  /**
   * Assess risk level from market data
   */
  private assessRiskFromData(
    marketData: MarketAnalysis
  ): "LOW" | "MEDIUM" | "HIGH" {
    if (marketData.volatility > 20 || marketData.liquidity < 100000) {
      return "HIGH";
    } else if (marketData.volatility > 10 || marketData.liquidity < 500000) {
      return "MEDIUM";
    }
    return "LOW";
  }

  /**
   * Calculate stop loss price
   */
  private calculateStopLoss(currentPrice: number, riskLevel: string): number {
    const stopLossPercentages = { LOW: 0.02, MEDIUM: 0.05, HIGH: 0.08 };
    const percentage =
      stopLossPercentages[riskLevel as keyof typeof stopLossPercentages] ||
      0.05;
    return currentPrice * (1 - percentage);
  }

  /**
   * Calculate take profit price
   */
  private calculateTakeProfit(currentPrice: number, riskLevel: string): number {
    const takeProfitPercentages = { LOW: 0.04, MEDIUM: 0.1, HIGH: 0.16 };
    const percentage =
      takeProfitPercentages[riskLevel as keyof typeof takeProfitPercentages] ||
      0.1;
    return currentPrice * (1 + percentage);
  }

  /**
   * Identify market conditions
   */
  private identifyMarketConditions(marketData: MarketAnalysis): string[] {
    const conditions = [];

    if (marketData.volatility > 15) conditions.push("HIGH_VOLATILITY");
    if (marketData.liquidity < 100000) conditions.push("LOW_LIQUIDITY");
    if (marketData.volume24h < 10000) conditions.push("LOW_VOLUME");
    if (marketData.priceChange24h > 10) conditions.push("HIGH_MOMENTUM");
    if (marketData.priceChange24h < -10) conditions.push("DOWNTREND");
    if (marketData.sentiment === "bullish")
      conditions.push("BULLISH_SENTIMENT");
    if (marketData.sentiment === "bearish")
      conditions.push("BEARISH_SENTIMENT");

    return conditions.length > 0 ? conditions : ["NORMAL"];
  }

  /**
   * Extract risk factors from response
   */
  private extractRiskFactors(response: string): string[] {
    const factors: string[] = [];
    const riskKeywords = [
      "volatility",
      "liquidity",
      "volume",
      "momentum",
      "trend",
    ];

    riskKeywords.forEach((keyword) => {
      if (response.toLowerCase().includes(keyword)) {
        factors.push(keyword.toUpperCase());
      }
    });

    return factors;
  }

  /**
   * Safely parse numeric balance from string/number inputs
   */
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

  /**
   * Get available balance for a specific asset (defaults to USDT)
   */
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
