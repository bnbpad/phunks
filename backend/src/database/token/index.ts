import mongoose, { Document, Model, Schema } from 'mongoose';

export type IPool = {
  pool: string | null;
  dex: 'pancake' | 'thena' | 'fourmeme' | null;
};

export type TokenLinks = {
  discordLink?: string;
  twitterLink?: string;
  telegramLink?: string;
  websiteLink?: string;
  twitchLink?: string;
  creatorLink?: string;
  launchTweetLink?: string;
};

export type IToken = {
  dex?: 'pancake' | 'fourmeme';
  basicDetails: {
    name: string;
    symbol: string;
    desc: string;
    image: string;
    address: string;
    chainId: number;
    chainType: string;
  };
  tokenomics: {
    fundingTokenAddress: string | null;
    fundingTokenDecimals: number | null;
    fundingTokenSymbol: string | null;
    dex: string | null;
    startingMC: number | null;
    endingMC: number | null;
    amountToBuy: string | null;
    startingTick: number | null;
    graduationTick: number | null;
    upperMaxTick: number | null;
    graduationLiquidity: number | null;
    tickSpacing: number | null;
    creatorAllocation: number | null;
  };
  links: TokenLinks;
  walletAddress: string;
  txHash: string;
  pool: IPool;
  createdAt?: string;
  updatedAt?: string;
};

export interface ITokenDocument extends IToken, Document {}

const TokenSchema: Schema = new Schema(
  {
    dex: { type: String, required: true, default: 'pancake' },
    basicDetails: {
      name: { type: String, required: true },
      symbol: { type: String, required: true },
      desc: { type: String },
      image: { type: String, required: true },
      address: { type: String, required: true },
      chainId: { type: Number, required: true },
      chainType: { type: String },
    },
    tokenomics: {
      fundingTokenAddress: { type: String },
      fundingTokenDecimals: { type: Number },
      fundingTokenSymbol: { type: String },
      dex: { type: String },
      startingMC: { type: Number },
      endingMC: { type: Number },
      amountToBuy: { type: String },
      startingTick: { type: Number },
      graduationTick: { type: Number },
      upperMaxTick: { type: Number },
      graduationLiquidity: { type: Number, default: 0 },
      tickSpacing: { type: Number, default: 1 },
      creatorAllocation: { type: Number, default: 0 },
    },
    links: {
      discordLink: { type: String, default: '' },
      twitterLink: { type: String, default: '' },
      telegramLink: { type: String, default: '' },
      websiteLink: { type: String, default: '' },
      twitchLink: { type: String, default: '' },
      creatorLink: { type: String, default: '' },
      launchTweetLink: { type: String, default: '' },
    },
    walletAddress: { type: String, required: true },
    txHash: { type: String },
    pool: {
      pool: { type: String },
      dex: { type: String },
    },
  },
  { timestamps: true }
);

export const Tokens: Model<ITokenDocument> = mongoose.model<ITokenDocument>('Token', TokenSchema);
