import { Router } from "express";
import rateLimit from "express-rate-limit";
import { rateLimitWindowAI, totalRequestsIPAI } from "../utils/constant";

const router = Router();
const ipLimiterAI = rateLimit({
  windowMs: rateLimitWindowAI,
  max: totalRequestsIPAI,
  message: {
    success: false,
    message: "Too many requests from this IP, please try again after an hour",
  },
});
/**
 * @swagger
 * /token/tradingRecommendation:
 *   post:
 *     summary: Get AI-assisted trading recommendation
 *     description: Accepts an array of market data for multiple tokens, detailed balance information, and risk tolerance. The AI analyzes all tokens and returns a single recommendation for the best token to trade based on technical indicators, sentiment, and risk-adjusted returns.
 *     tags:
 *       - Token
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - marketData
 *               - balances
 *               - riskTolerance
 *             properties:
 *               marketData:
 *                 type: array
 *                 description: Array of current market snapshots for tokens.
 *                 items:
 *                   type: object
 *                   required:
 *                     - token
 *                     - price
 *                     - volume24h
 *                     - marketCap
 *                     - priceChange24h
 *                     - volatility
 *                     - liquidity
 *                     - sentiment
 *                     - technicalIndicators
 *                   properties:
 *                     token:
 *                       type: string
 *                     price:
 *                       type: number
 *                     volume24h:
 *                       type: number
 *                     marketCap:
 *                       type: number
 *                     priceChange24h:
 *                       type: number
 *                     volatility:
 *                       type: number
 *                     liquidity:
 *                       type: number
 *                     sentiment:
 *                       type: string
 *                       enum: [bullish, bearish, neutral]
 *                     technicalIndicators:
 *                       type: object
 *                       properties:
 *                         rsi:
 *                           type: number
 *                         macd:
 *                           type: number
 *                         movingAverage20:
 *                           type: number
 *                         movingAverage50:
 *                           type: number
 *               balances:
 *                 type: array
 *                 description: Array of account balances used to contextualize risk and position sizing.
 *                 items:
 *                   type: object
 *                   required:
 *                     - asset
 *                     - availableBalance
 *                   properties:
 *                     asset:
 *                       type: string
 *                     availableBalance:
 *                       oneOf:
 *                         - type: string
 *                         - type: number
 *                       description: Available balance for the asset.
 *                     accountAlias:
 *                       type: string
 *                     balance:
 *                       type: string
 *                     crossWalletBalance:
 *                       type: string
 *                     crossUnPnl:
 *                       type: string
 *                     maxWithdrawAmount:
 *                       type: string
 *                     marginAvailable:
 *                       type: boolean
 *                     updateTime:
 *                       type: number
 *               riskTolerance:
 *                 type: string
 *                 enum: [LOW, MEDIUM, HIGH]
 *                 description: User-defined risk tolerance level.
 *     responses:
 *       200:
 *         description: Trading recommendation generated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   description: Trading recommendation for the best token selected from the provided market data.
 *                   properties:
 *                     action:
 *                       type: string
 *                       enum: [BUY, SELL, HOLD]
 *                     confidence:
 *                       type: number
 *                     reasoning:
 *                       type: string
 *                     riskLevel:
 *                       type: string
 *                       enum: [LOW, MEDIUM, HIGH]
 *                     positionSize:
 *                       type: number
 *                       description: Percentage of available balance to allocate (0-1).
 *                     stopLoss:
 *                       type: number
 *                     takeProfit:
 *                       type: number
 *                     marketConditions:
 *                       type: array
 *                       items:
 *                         type: string
 *                     selectedToken:
 *                       type: string
 *                       description: The token that was selected as the best trading opportunity.
 *       400:
 *         description: Missing or invalid inputs.
 *       500:
 *         description: Failed to generate recommendation.
 */

export default router;
