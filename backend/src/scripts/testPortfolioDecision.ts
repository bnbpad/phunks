import {
  OllamaDecisionEngine,
  Balance,
  MarketAnalysis,
  UserPosition,
} from "../controllers/ai-models/OllamaDecisionEngine";
import { AIDecisions } from "../database/AIDecison";

async function main() {
  console.log("Starting portfolio decision test...");

  const balances: Balance[] = [
    {
      accountAlias: "main",
      asset: "USDT",
      balance: "1000",
      crossWalletBalance: "1000",
      crossUnPnl: "0",
      availableBalance: "1000",
      maxWithdrawAmount: "1000",
      marginAvailable: true,
      updateTime: Date.now(),
    },
  ];

  const marketDataArray: MarketAnalysis[] = [
    {
      token: "ZRX",
      price: 0.7,
      volume24h: 5_000_000,
      marketCap: 400_000_000,
      priceChange24h: 3.5,
      volatility: 15,
      liquidity: 1_000_000,
      sentiment: "bullish",
      technicalIndicators: {
        rsi: 55,
        macd: 0.01,
        movingAverage20: 0.68,
        movingAverage50: 0.65,
      },
    },
    {
      token: "ETH",
      price: 3500,
      volume24h: 15_000_000_000,
      marketCap: 400_000_000_000,
      priceChange24h: -1.2,
      volatility: 10,
      liquidity: 10_000_000,
      sentiment: "neutral",
      technicalIndicators: {
        rsi: 48,
        macd: -0.02,
        movingAverage20: 3450,
        movingAverage50: 3300,
      },
    },
  ];

  // Dummy user positions
  const userPositions: UserPosition[] = [
    {
      protocolName: "0x",
      chain: "eth",
      token: "ZRX",
      amount: 100,
      usdValue: 70,
      entryPrice: 0.6,
      pnlUsd: 10,
      positionType: "SPOT",
    },
  ];

  const engine = new OllamaDecisionEngine();

  console.log("Requesting portfolio decision from OpenAI...");
  const decision = await engine.getPortfolioDecision(
    marketDataArray,
    balances,
    userPositions,
    "MEDIUM",
    "test"
  );

  console.log("Portfolio decision result:");
  await AIDecisions.create({
    agentId: "test",
    decision: decision.decision,
    prompt: decision.prompt,
    tasks: decision.tasks,
  });
}

main().catch((err) => {
  console.error("Error while testing portfolio decision:", err);
  process.exit(1);
});
