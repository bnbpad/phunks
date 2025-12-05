export interface TokenPool {
  pool: string;
  token0: string;
  token1: string;
  totalNothVolume: string;
  fee?: number;
  tickSpacing?: number;
}

export interface Holder {
  address: string;
  amount: string;
  lastUpdated?: string;
}

export interface TokenHolding {
  id: string;
  name: string;
  symbol: string;
  totalSupply: string;
  transactionHash: string;
  fundingToken: string;
  creator: string;
  graduated: boolean;
  metadata: string;
  holderCount: number;
  holders: Holder[];
  pool: TokenPool;
}

export interface TokenSearch {
  id: string;
  name: string;
  symbol: string;
  creator: string;
  createdAt: string;
  graduated: boolean;
  holderCount: number;
  fundingToken: string;
  metadata: string;
  pool: {
    token0: string;
    token1: string;
  };
}

export interface TokenList {
  id: string;
  name: string;
  symbol: string;
  totalSupply: string;
  transactionHash: string;
  fundingToken: string;
  creator: string;
  graduated: boolean;
  metadata: string;
  holderCount: number;
  pool: TokenPool;
}

export interface TokenHolders {
  id: string;
  totalSupply: string;
  holders: Holder[];
}

export interface TokenHistory {
  id: string;
  name: string;
  metadata: string;
  pool: {
    token1: string;
    totalNothVolume: string;
  };
}

export interface Token {
  id: string;
  tokenAddress: string;
  tokenName: string;
  tokenSymbol: string;
  tokenDecimals: number;
  metadata: {
    basicDetails: {
      name: string;
      symbol: string;
      description: string;
      logo: string;
    };
  };
  trades: {
    id: string;
    timestamp: string;
    price: string;
    amount: string;
    type: string;
  }[];
}

export interface TokenOfTheDayParams {
  dbTokens: string[];
  blacklistedTokens: string[];
}

export type SubgraphResponse<T> = {
  data: {
    tokens?: T[];
    token?: T;
    trades?: T[];
    holders?: T[];
    search?: T[];
    tokenHolding?: T[];
    tokenBalances?: T[];
    pools?: T[];
    airdropDistributions?: T[];
    votingPowerSnapshots?: T[];
  };
};

export interface ListTokensParams {
  skip: number;
  limit: number;
  dbTokens: string[];
  blacklistedTokens: string[];
}

export interface TokenHistoryParams {
  dbTokens: string[];
}

export interface AllTokenHoldersParams {
  dbTokens: string[];
  blacklistedTokens: string[];
}
export interface TokenHoldersParams {
  tokenAddress: string;
  skip: number;
}

export interface TokenHoldingParams {
  formattedAddress: string;
  blacklistedTokens: string[];
}

export interface SearchTokensParams {
  dbTokens: string[];
}

export interface TokenOfTheDay {
  id: string;
  name: string;
  symbol: string;
  totalSupply: string;
  transactionHash: string;
  fundingToken: string;
  creator: string;
  graduated: boolean;
  metadata: string;
  holderCount: number;
  pool: {
    pool: string;
    token0: string;
    token1: string;
    totalNothVolume: string;
  };
}
export interface GetSingleTokenHolding {
  id: string;
  holders: {
    holder: string;
    amount: string;
  }[];
}

export interface GetSingleTokenHoldingParams {
  formattedAddress: string;
  tokenAddress: string;
}

export interface GetUserFeesParams {
  senders?: string[];
  premium?: string[];
}

export interface ReferralReward {
  token0: string;
  trade: {
    protocolFeesToken0: string;
    protocolFeesToken1: string;
    timestamp: string;
    amount0: string;
    amount1: string;
  }[];
}

export interface AirdropDistribution {
  id: string;
  blockNumber: number;
  amount: string;
  totalVotingPower: string;
}

export interface AirdropDistributionParams {
  blockNumber: number;
  snapshotId: string;
}

export interface VotingPowerSnapshotParams {
  blockNumber: string;
  walletAddress: string;
}
export interface VotingPowerSnapshot {
  id: string;
  votingPower: string;
  blockNumber: number;
}
