import mongoose, { Document, Model, Schema } from 'mongoose';

export type TradeAction = 'BUY' | 'SELL' | 'HOLD';
export type RiskLevel = 'HIGH' | 'MEDIUM' | 'LOW';
export type TradeStatus = 'pending' | 'completed' | 'failed' | 'cancelled';
export type MarketCondition =
  | 'LOW_LIQUIDITY'
  | 'HIGH_MOMENTUM'
  | 'BULLISH_SENTIMENT'
  | 'BEARISH_SENTIMENT'
  | 'HIGH_VOLATILITY'
  | 'STABLE';

export interface ITechnicalIndicators {
  rsi: number;
  macd: number;
  movingAverage20: number;
  movingAverage50: number;
}

export interface IMarketData {
  token: string;
  price: number;
  volume24h: number;
  marketCap: number;
  priceChange24h: number;
  volatility: number;
  liquidity: number;
  sentiment: 'bullish' | 'bearish' | 'neutral';
  technicalIndicators: ITechnicalIndicators;
}

export interface ITransactionData {
  orderId: number;
  symbol: string;
  status: string;
  clientOrderId: string;
  price: string;
  avgPrice: string;
  origQty: string;
  executedQty: string;
  cumQty: string;
  cumQuote: string;
  timeInForce: string;
  type: string;
  reduceOnly: boolean;
  closePosition: boolean;
  side: string;
  positionSide: string;
  stopPrice: string;
  workingType: string;
  priceProtect: boolean;
  origType: string;
  updateTime: number;
}

export interface ITrade {
  dex: 'aster' | 'fourmeme';
  tokenAddress: string;
  action: TradeAction;
  symbol: string;
  amount: number;
  price: number;
  prompt: string;
  reasoning: string;
  confidence: number;
  riskLevel: RiskLevel;
  positionSize: number;
  stopLoss?: number;
  takeProfit?: number;
  marketConditions: MarketCondition[];
  marketData: IMarketData;
  transactionFrom: string;
  status: TradeStatus;
  gasUsed?: string;
  transactionHash?: string;
  transactionData?: ITransactionData;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ITradeDocument extends ITrade, Document {}

const TradeSchema: Schema = new Schema(
  {
    tokenAddress: {
      type: String,
      required: true,
      lowercase: true,
      index: true,
    },
    dex: {
      type: String,
      required: true,
      enum: ['aster', 'fourmeme'],
    },
    action: {
      type: String,
      required: true,
      enum: ['BUY', 'SELL', 'HOLD'],
    },
    symbol: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    prompt: {
      type: String,
      required: true,
    },
    reasoning: {
      type: String,
      required: true,
    },
    confidence: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    riskLevel: {
      type: String,
      required: true,
      enum: ['HIGH', 'MEDIUM', 'LOW'],
    },
    positionSize: {
      type: Number,
      required: true,
    },
    stopLoss: {
      type: Number,
    },
    takeProfit: {
      type: Number,
    },
    marketConditions: {
      type: [String],
      enum: [
        'LOW_LIQUIDITY',
        'HIGH_MOMENTUM',
        'BULLISH_SENTIMENT',
        'BEARISH_SENTIMENT',
        'HIGH_VOLATILITY',
        'STABLE',
        'DOWNTREND',
      ],
      default: [],
    },
    marketData: {
      token: {
        type: String,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
      volume24h: {
        type: Number,
        required: true,
      },
      marketCap: {
        type: Number,
        required: true,
      },
      priceChange24h: {
        type: Number,
        required: true,
      },
      volatility: {
        type: Number,
        required: true,
      },
      liquidity: {
        type: Number,
        required: true,
      },
      sentiment: {
        type: String,
        required: true,
        enum: ['bullish', 'bearish', 'neutral'],
      },
      technicalIndicators: {
        rsi: {
          type: Number,
          required: true,
        },
        macd: {
          type: Number,
          required: true,
        },
        movingAverage20: {
          type: Number,
          required: true,
        },
        movingAverage50: {
          type: Number,
          required: true,
        },
      },
    },
    transactionFrom: {
      type: String,
      required: true,
      lowercase: true,
    },
    status: {
      type: String,
      required: true,
      enum: ['pending', 'completed', 'failed', 'cancelled'],
      default: 'pending',
    },
    gasUsed: {
      type: String,
    },
    transactionHash: {
      type: String,
      index: true,
    },
    transactionData: {
      type: Object,
      required: false,
    },
  },
  { timestamps: true }
);

export const Trades: Model<ITradeDocument> = mongoose.model<ITradeDocument>('Trade', TradeSchema);
