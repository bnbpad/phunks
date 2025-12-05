import { Tokens } from "../../database/token";
import { getTokenOfTheDay } from "../../subgraph";
import { blackListedTokens, BNBPAD_PRICE } from "../../utils/constant";
import { tokenDecimalsNormalisationMap } from "../../utils/getPrice";
import { fetchTokenData } from "./details";
import { BadRequestError, NotFoundError } from "../../errors";
import { TokenOfTheDayParams } from "../../subgraph/types";

interface IResult {
  id: string;
  totalFTVolume: number;
  totalFTVolumeUsd: number;
  marketCapInUSD: number;
}

/**
 * Get the token of the day for a given chain
 * @param chainId - The chain ID to get the token of the day for
 * @returns The token of the day for the given chain
 */
export const getDailyTokenInfo = async (chainId: string) => {
  if (!chainId) throw new BadRequestError("Invalid chainId");

  const now = new Date();

  const utcYear = now.getUTCFullYear();
  const utcMonth = now.getUTCMonth();
  const utcDate = now.getUTCDate();

  // // if token data is not available for the day, then get the data for the previous day
  // const utcStartTimestamp = Math.floor(Date.UTC(utcYear, utcMonth, utcDate) / 1000);
  // const utcEndTimestamp = Math.floor(Date.UTC(utcYear, utcMonth, utcDate + 1) / 1000);
  const tokensInDB = await Tokens.find({
    "basicDetails.chainId": Number(chainId),
  }).select("basicDetails");

  const tokenAddressesDB = tokensInDB.map(
    (token) => token.basicDetails.address
  );

  if (tokenAddressesDB.length === 0) {
    tokenAddressesDB.push(blackListedTokens[0]);
  }

  const params: TokenOfTheDayParams = {
    dbTokens: tokenAddressesDB,
    blacklistedTokens: blackListedTokens.map((token) => token.toLowerCase()),
  };

  let tokenOfTheDayResult = await _getTokenOfTheDay(chainId, params);

  if (!tokenOfTheDayResult) {
    const tempToken = await Tokens.findOne({
      "basicDetails.chainId": Number(chainId),
    })
      .sort({ createdAt: -1 })
      .select("basicDetails.address tokenomics.startingMC");
    tokenOfTheDayResult = {
      id: tempToken?.basicDetails.address ?? "",
      totalFTVolume: 0,
      totalFTVolumeUsd: 0,
      marketCapInUSD: tempToken?.tokenomics.startingMC ?? 0,
    };
  }

  const response = await fetchTokenData(tokenOfTheDayResult.id, chainId);
  if (!response) throw new NotFoundError("Token not found in Graph");

  const {
    tokenData,
    marketCapInUSD,
    basePrice,
    totalFTVolume,
    totalFTVolumeUsd,
    pool,
  } = response;
  const tokenInDb = tokensInDB.find(
    (token) => token.basicDetails.address === tokenOfTheDayResult.id
  );
  return {
    tokenOfTheDay: {
      basicDetails: tokenInDb?.basicDetails,
      tokenomics: tokenInDb?.tokenomics,
      links: tokenInDb?.links,
      reviewed: tokenData.reviewed,
      walletAddress: tokenData.creator,
      launchRightAway: tokenData.launchRightAway || false,
      usdMarketCap: marketCapInUSD,
      basePrice,
      totalFTVolume,
      totalFTVolumeUsd,
      holderCount: tokenData.holderCount,
      pool: {
        token0: pool.token0,
        token1: pool.token1,
        fee: pool.fee,
        tickSpacing: pool.tickSpacing,
        pool: pool.pool,
        totalFTVolume: pool.totalNothVolume,
      },
    },
    totalFTVolume: totalFTVolume,
    totalFTVolumeUsd: totalFTVolumeUsd,
  };
};

const _getTokenOfTheDay = async (
  chainId: string,
  params: TokenOfTheDayParams
): Promise<IResult | undefined> => {
  const tokensData = await getTokenOfTheDay(Number(chainId), params);
  if (!tokensData || tokensData.length === 0) {
    throw new Error("No tokens found for the given chain in the DB.");
  }

  let tokenOfTheDayResult: IResult | undefined;

  await Promise.all(
    tokensData.map(async (token: any) => {
      const pool = token.pool;

      const quoteTokenPrice = BNBPAD_PRICE;

      const marketCapInUSD =
        (quoteTokenPrice * Number(token.totalSupply)) / 1e18;
      const totalFTVolume = Number(pool?.totalNothVolume || "0");
      const totalFTVolumeUsd = totalFTVolume * quoteTokenPrice;

      tokenOfTheDayResult = {
        id: pool.token0,
        totalFTVolume,
        totalFTVolumeUsd,
        marketCapInUSD,
      };
    })
  );

  return tokenOfTheDayResult;
};
