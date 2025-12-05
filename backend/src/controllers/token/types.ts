import { IPool, TokenLinks } from '../../database/token';
import { IAiThesisPayload } from '../../database/aiThesis';

export interface ICreateToken {
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
    fundingTokenAddress: string;
    fundingTokenDecimals: number;
    fundingTokenSymbol: string;
    dex: string;
    startingMC: number;
    endingMC: number;
    amountToBuy: string;
    startingTick: number;
    graduationTick: number;
    upperMaxTick: number;
    graduationLiquidity: number;
    tickSpacing: number;
    creatorAllocation: number;
  };
  walletAddress?: string;
  links: TokenLinks;
  txHash: string;
  pool: IPool;
  aiThesis: IAiThesisPayload;
}
export interface ITokenResult {
  id: string;
  totalFTVolume: number;
  totalFTVolumeUsd: number;
}

export interface ITokenData {
  tokenData: any;
  // isPremium: boolean;
  basicDetails: any;
  tokenomics: any;
  // taxInfo: any;
  // taxDistribution: any;
  // fees: any;
  links: any;
  marketCapInUSD: number;
  basePrice: number;
  totalFTVolume: number;
  totalFTVolumeUsd: number;
  pool: any;
}

export interface ICreateFourMemeToken {
  name: string;
  shortName: string;
  desc: string;
  imgUrl: string;
  launchTime: number;
  label: string;
  lpTradingFee: number;
  webUrl?: string;
  twitterUrl?: string;
  telegramUrl?: string;
  preSale: string;
  onlyMPC?: boolean;
  totalSupply: number;
  raisedAmount: number;
  saleRate: number;
  reserveRate: number;
  funGroup: boolean;
  clickFun: boolean;
  symbol: string;
}
