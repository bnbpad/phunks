import axios from 'axios';
import {
  SubgraphResponse,
  TokenHolding,
  TokenList,
  TokenHolders,
  TokenHistory,
  TokenSearch,
  ListTokensParams,
  TokenHistoryParams,
  TokenHoldersParams,
  TokenHoldingParams,
  SearchTokensParams,
  TokenOfTheDayParams,
  TokenOfTheDay,
  AllTokenHoldersParams,
  GetSingleTokenHoldingParams,
  GetSingleTokenHolding,
  GetUserFeesParams,
  ReferralReward,
  AirdropDistribution,
  VotingPowerSnapshotParams,
  VotingPowerSnapshot,
} from './types';
import {
  listTokensQuery,
  tokenHistory,
  getTokenHoldersQuery,
  getTokenQuery,
  tokenOfTheDay,
  allTokenHolders,
  getSingleTokenHoldingQuery,
  referralRewardQuery,
  airdropDistributionQuery,
  votingPowerSnapshotQuery,
} from './queries';
import nconf from '../config/nconf';
import { blackListedTokens } from '../utils/constant';

const GRAPH_API_URLS: { [chainId: string]: string } = {
  '56': nconf.get('SUBGRAPH_BSC'),
};

export class SubgraphError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'SubgraphError';
  }
}

/**
 * Helper function to query the subgraph from Sentio with the correct type
 * @param chainId - The chain ID to query
 * @param query - The query to execute
 * @param variables - The variables to pass to the query
 * @returns The response from the subgraph
 */
export async function querySubgraph<T>(
  chainId: string,
  query: string,
  variables: Record<string, any>
): Promise<SubgraphResponse<T>> {
  const url = GRAPH_API_URLS[chainId];
  if (!url) throw new SubgraphError(`No subgraph URL found for chainId: ${chainId}`);

  try {
    const response = await axios.post(
      url,
      {
        query,
        variables,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'api-key': nconf.get('SENTIO_API_KEY'),
        },
      }
    );

    if (response.data.errors)
      throw new SubgraphError(`Subgraph query failed: ${JSON.stringify(response.data.errors)}`);

    return response.data;
  } catch (error: unknown) {
    if (error instanceof SubgraphError) throw error;

    if (error instanceof Error) {
      throw new SubgraphError(`Failed to query subgraph: ${error.message}`);
    }

    throw new SubgraphError('Failed to query subgraph: Unknown error');
  }
}

export async function listTokens(chainId: string, params: ListTokensParams): Promise<TokenList[]> {
  if (params.dbTokens.length === 0) {
    params.dbTokens = [blackListedTokens[0]];
  }
  const response = await querySubgraph<TokenList>(chainId, listTokensQuery, params);
  return response.data.tokens || [];
}

export async function getTokenHistory(
  chainId: string,
  params: TokenHistoryParams
): Promise<TokenHistory[]> {
  const response = await querySubgraph<TokenHistory>(chainId, tokenHistory, {
    dbTokens: params.dbTokens,
  });
  return response.data.tokens || [];
}

export async function getTokenHolders(
  chainId: string,
  params: TokenHoldersParams
): Promise<TokenHolders[]> {
  const response = await querySubgraph<TokenHolders>(chainId, getTokenHoldersQuery, params);
  return response.data.tokens || [];
}

export async function getTokenHolding(
  chainId: string,
  params: TokenHoldingParams
): Promise<TokenHolding[]> {
  const response = await querySubgraph<TokenHolding>(chainId, getTokenQuery, params);
  return response.data.tokenHolding || [];
}

export const getTokenOfTheDay = async (
  chainId: number,
  params: TokenOfTheDayParams
): Promise<TokenOfTheDay[]> => {
  const response = await querySubgraph<TokenOfTheDay>(chainId.toString(), tokenOfTheDay, params);
  return response.data.tokens || [];
};

export const getAllTokenHolders = async (
  chainId: string,
  params: AllTokenHoldersParams
): Promise<TokenHolders[]> => {
  const response = await querySubgraph<TokenHolders>(chainId, allTokenHolders, params);
  return response.data.tokens || [];
};

export const getSingleTokenHolding = async (
  chainId: string,
  params: GetSingleTokenHoldingParams
): Promise<GetSingleTokenHolding[]> => {
  const response = await querySubgraph<GetSingleTokenHolding>(
    chainId,
    getSingleTokenHoldingQuery,
    params
  );
  return response.data.tokens || [];
};

export const getUserFees = async (
  chainId: string,
  params: GetUserFeesParams
): Promise<ReferralReward[]> => {
  const response = await querySubgraph<ReferralReward>(chainId, referralRewardQuery, params);
  return response.data.pools || [];
};

export const getAirdropDistribution = async (chainId: string): Promise<AirdropDistribution[]> => {
  const response = await querySubgraph<AirdropDistribution>(chainId, airdropDistributionQuery, {});
  return response.data.airdropDistributions || [];
};

export const getVotingPowerSnapshot = async (
  chainId: string,
  params: VotingPowerSnapshotParams
): Promise<VotingPowerSnapshot[]> => {
  const response = await querySubgraph<VotingPowerSnapshot>(
    chainId,
    votingPowerSnapshotQuery,
    params
  );
  return response.data.votingPowerSnapshots || [];
};
