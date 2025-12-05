import mongoose, { Document, Model, Schema } from 'mongoose';

export type AiThesisStrategy = {
  indicatorsEnabled: string[];
  riskLevel: string;
  enabledFeatures: string[];
  maxTradeSizeInPercentageOfBalance: number;
  maxDailyTrades: number;
  cooldownAfterLoss: number;
  requireConfirmation: boolean;
  autoStopLoss: boolean;
  autoTakeProfit: boolean;
  maxLeverage: number;
  tokens: {
    whitelistedSymbols: string[];
    whitelistCriteria: string;
    leverageOverride: Record<string, number>;
  };
  prompt: {
    goals: string;
    tradingStrategy: string;
    riskStrategy: string;
    positionSizingStrategy: string;
  };
};

export type AiThesisCore = {
  name: string;
  description: string;
  version: string;
  strategy: AiThesisStrategy;
};

export interface IAiThesis extends AiThesisCore {
  tokenAddress: string;
  chainId: number;
  createdAt?: string;
  updatedAt?: string;
}

export type IAiThesisPayload = AiThesisCore;

export interface IAiThesisDocument extends IAiThesis, Document {}

const AiThesisSchema: Schema = new Schema(
  {
    tokenAddress: { type: String, required: true, lowercase: true, trim: true },
    chainId: { type: Number, required: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    version: { type: String, required: true },
    strategy: {
      indicatorsEnabled: {
        type: [String],
        required: true,
      },
      riskLevel: { type: String, required: true },
      enabledFeatures: {
        type: [String],
        required: true,
      },
      maxTradeSizeInPercentageOfBalance: { type: Number, required: true },
      maxDailyTrades: { type: Number, required: true },
      cooldownAfterLoss: { type: Number, required: true },
      requireConfirmation: { type: Boolean, required: true },
      autoStopLoss: { type: Boolean, required: true },
      autoTakeProfit: { type: Boolean, required: true },
      maxLeverage: { type: Number, required: true },
      tokens: {
        whitelistedSymbols: {
          type: [String],
          required: true,
        },
        whitelistCriteria: { type: String, required: true },
        leverageOverride: {
          type: Map,
          of: Number,
          required: true,
        },
      },
      prompt: {
        goals: { type: String, required: true },
        tradingStrategy: { type: String, required: true },
        riskStrategy: { type: String, required: true },
        positionSizingStrategy: { type: String, required: true },
      },
    },
  },
  { timestamps: true }
);

AiThesisSchema.index({ tokenAddress: 1 }, { unique: true });

export const AiThesisModel: Model<IAiThesisDocument> = mongoose.model<IAiThesisDocument>(
  'AiThesis',
  AiThesisSchema
);
