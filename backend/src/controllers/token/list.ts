import { Tokens, ITokenDocument } from '../../database/token';
import { BadRequestError } from '../../errors';
import { listTokens } from '../../subgraph';
import { blackListedTokens, BNBPAD_PRICE } from '../../utils/constant';
import { ListTokensParams } from '../../subgraph/types';
import { getTokenLike } from './likes';

export type SortOption = 'marketCap' | 'createdAt' | 'lastReply' | 'views' | 'totalFTVolume';

/**
 * Get the list of tokens
 * @param chainId - The chain ID to get the tokens for
 * @param limit - The number of tokens to return
 * @param page - The page number to return
 * @param sortBy - The field to sort the tokens by
 * @param order - The order to sort the tokens by
 * @returns The list of tokens
 */
export const listTokensController = async (
  chainId: string,
  limit: number,
  page: number,
  sortBy: SortOption = 'createdAt',
  order: 'asc' | 'desc' = 'desc'
) => {
  const pageNumber = page || 1;
  const limitNumber = limit || 50;
  const skip = (pageNumber - 1) * limitNumber;

  if (limitNumber > 50) {
    throw new BadRequestError('Limit should be less than or equal to 50');
  }
  const sortDirection = order === 'asc' ? 1 : -1;

  const tokensInDB: ITokenDocument[] = await Tokens.find({
    'basicDetails.chainId': Number(chainId),
  }).select('basicDetails createdAt walletAddress dex tokenomics.dex');

  const allTokensDetail = await getTokensDetail(chainId, skip, pageNumber, limitNumber, tokensInDB);

  const finalData = Array.isArray(allTokensDetail) ? allTokensDetail : [];

  if (sortBy === 'marketCap') {
    finalData.sort((a, b) => sortDirection * ((a.usdMarketCap || 0) - (b.usdMarketCap || 0)));
  } else if (sortBy === 'createdAt') {
    finalData.sort((a, b) => sortDirection * ((a.createdAt || 0) - (b.createdAt || 0)));
  } else if (sortBy === 'lastReply') {
    // todo: add last reply
    // finalData.sort((a, b) => sortDirection * ((a.lastReplyAt || 0) - (b.lastReplyAt || 0)));
  } else if (sortBy === 'views') {
    // todo: add views
    // finalData.sort((a, b) => sortDirection * ((a.views || 0) - (b.views || 0)));
  } else if (sortBy === 'totalFTVolume') {
    finalData.sort(
      (a, b) => sortDirection * ((a.totalFTVolumeUsd || 0) - (b.totalFTVolumeUsd || 0))
    );
  }

  const paginatedData = finalData.slice(skip, skip + limitNumber);

  return {
    data: paginatedData,
    count: paginatedData.length,
    page: pageNumber,
    limit: limitNumber,
    totalTokens: finalData.length,
  };
};

export const searchData = async (chainId: string) => {
  if (!chainId || isNaN(Number(chainId))) {
    throw new BadRequestError('Invalid or unsupported chainId / graph');
  }

  const tokensInDB = await Tokens.find({
    'basicDetails.chainId': Number(chainId),
  }).select('basicDetails walletAddress tokenomics links createdAt');

  return tokensInDB.map(token => {
    return {
      basicDetails: token.basicDetails,
      tokenomics: token.tokenomics || {},
      links: token.links || {},
      createdAt: token.createdAt ? Math.floor(new Date(token?.createdAt).getTime() / 1000) : 0,
    };
  });
};

export const getTokensDetail = async (
  chainId: string,
  skip: number,
  pageNumber: number,
  limit: number,
  dbTokens: ITokenDocument[]
) => {
  // If no tokens in database, return empty array
  if (dbTokens.length === 0) {
    return [];
  }

  const dbTokensMap = new Map(
    dbTokens.map(token => [token.basicDetails.address.toLowerCase(), token])
  );

  const bnbpadTokens = dbTokens.filter(token => {
    const dex = token.dex;
    return !dex || dex === 'pancake';
  });
  const fourmemeTokens = dbTokens.filter(token => {
    return token.dex === 'fourmeme';
  });

  const params: ListTokensParams = {
    skip: 0,
    limit: 1000,
    dbTokens: bnbpadTokens.map(token => token.basicDetails.address),
    blacklistedTokens: blackListedTokens.map(token => token.toLowerCase()),
  };

  const subgraphTokens = await listTokens(chainId, params);
  const subgraphTokenAddresses = new Set(subgraphTokens.map(token => token.id.toLowerCase()));

  const bnbpadTokenDetails = await Promise.all(
    subgraphTokens.map(async token => {
      const tokenFromDb = dbTokensMap.get(token.id.toLowerCase());
      const basicDetails = tokenFromDb?.basicDetails;

      const totalFTVolume = Number(token.pool?.totalNothVolume || '0') / 1e18;
      const totalFTVolumeUsd = totalFTVolume * (BNBPAD_PRICE || 0);
      const marketCapInUSD = (Number(token.totalSupply) / 1e18) * (BNBPAD_PRICE || 0);
      const basePrice = 0;

      const likes = await getTokenLike(basicDetails?.address || '');
      return {
        dex: tokenFromDb?.dex || 'pancake',
        basicDetails,
        walletAddress: token.creator || tokenFromDb?.walletAddress || '',
        usdMarketCap: marketCapInUSD,
        basePrice,
        totalFTVolume,
        totalFTVolumeUsd,
        holdersCount: token.holderCount || 0,
        createdAt: tokenFromDb?.createdAt
          ? Math.floor(new Date(tokenFromDb?.createdAt).getTime() / 1000)
          : 0,
        likes,
      };
    })
  );

  const bnbpadTokensNotInSubgraph = bnbpadTokens.filter(
    token => !subgraphTokenAddresses.has(token.basicDetails.address.toLowerCase())
  );

  const bnbpadFallbackDetails = await Promise.all(
    bnbpadTokensNotInSubgraph.map(async token => {
      const basicDetails = token.basicDetails;

      const likes = await getTokenLike(basicDetails.address);
      return {
        dex: token.dex || 'pancake',
        basicDetails,
        walletAddress: token.walletAddress || '',
        usdMarketCap: 0,
        basePrice: 0,
        totalFTVolume: 0,
        totalFTVolumeUsd: 0,
        holdersCount: 0,
        createdAt: token.createdAt ? Math.floor(new Date(token.createdAt).getTime() / 1000) : 0,
        likes,
      };
    })
  );

  const fourmemeTokenDetails = await Promise.all(
    fourmemeTokens.map(async token => {
      const basicDetails = token.basicDetails;

      const likes = await getTokenLike(basicDetails.address);
      return {
        dex: token.dex || 'fourmeme',
        basicDetails,
        walletAddress: token.walletAddress || '',
        usdMarketCap: 0,
        basePrice: 0,
        totalFTVolume: 0,
        totalFTVolumeUsd: 0,
        holdersCount: 0,
        createdAt: token.createdAt ? Math.floor(new Date(token.createdAt).getTime() / 1000) : 0,
        likes,
      };
    })
  );

  const allTokens = [...bnbpadTokenDetails, ...bnbpadFallbackDetails, ...fourmemeTokenDetails];

  if (limit > 0 && limit < 10000) {
    return allTokens.slice(0, limit);
  }

  return allTokens;
};
