import { Tokens, IToken } from "../../database/token";
import { Views } from "../../database/views";
import { getTokenHolding } from "../../subgraph";
import { blackListedTokens, BNBPAD_PRICE } from "../../utils/constant";
import { ITokenData } from "./types";
import { BadRequestError, NotFoundError } from "../../errors";
import { TokenHoldingParams } from "../../subgraph/types";
import { getTokenLike } from "./likes";

/**
 * Get the details of a token
 * @param tokenAddress - The address of the token
 * @param chainId - The chain ID of the token
 * @returns The details of the token
 */
export const getToken = async (tokenAddress: string, chainId: string) => {
  if (!tokenAddress || !chainId)
    throw new BadRequestError("tokenAddress and chainId are required");

  const formattedAddress = tokenAddress.toLowerCase().trim();
  const TokenDetails = await Tokens.findOne({
    "basicDetails.address": formattedAddress,
  }).select("basicDetails tokenomics links walletAddress pool createdAt dex");

  if (!TokenDetails) throw new NotFoundError("Token not found");

  let fetchedData: ITokenData | null = null;
  if (TokenDetails.dex === "fourmeme") {
    fetchedData = await _getDefaultTokenData(TokenDetails);
  } else {
    fetchedData = await fetchTokenData(formattedAddress, chainId);
    if (!fetchedData) {
      fetchedData = await _getDefaultTokenData(TokenDetails);
    }
  }

  const {
    tokenData,
    marketCapInUSD,
    basePrice,
    totalFTVolume,
    totalFTVolumeUsd,
    pool,
  } = fetchedData;

  const view = await Views.findOneAndUpdate(
    { tokenAddress: tokenAddress.toLowerCase() },
    { $inc: { views: 1 } },
    { upsert: true, new: true }
  );

  const likes = await getTokenLike(tokenAddress.toLowerCase().trim());
  const createdAt = TokenDetails.createdAt
    ? Math.floor(new Date(TokenDetails.createdAt).getTime() / 1000)
    : 0;
  return {
    dex: TokenDetails.dex,
    basicDetails: TokenDetails.basicDetails,
    tokenomics: TokenDetails.tokenomics,
    links: TokenDetails.links,
    reviewed: tokenData.reviewed,
    walletAddress: TokenDetails.walletAddress,
    launchRightAway: tokenData.launchRightAway || false,
    usdMarketCap: marketCapInUSD,
    basePrice,
    totalFTVolume,
    totalFTVolumeUsd,
    holderCount: tokenData.holderCount,
    views: view.views,
    createdAt,
    likes,
    pool: {
      token0: pool.token0,
      token1: pool.token1,
      fee: pool.fee,
      tickSpacing: pool.tickSpacing,
      pool: pool.pool,
      totalFTVolume: pool.totalNothVolume,
    },
  };
};

/**
 * Fetch the token data from the subgraph
 * @param tokenAddress - The address of the token
 * @param chainId - The chain ID of the token
 * @returns The token data
 */
export const fetchTokenData = async (
  tokenAddress: string,
  chainId: string
): Promise<ITokenData | null> => {
  const params: TokenHoldingParams = {
    formattedAddress: tokenAddress.toLowerCase(),
    blacklistedTokens: blackListedTokens.map((token) => token.toLowerCase()),
  };

  const tokenData = await getTokenHolding(chainId, params);
  if (!tokenData || tokenData.length === 0) return null;

  const token = tokenData[0];
  const pool = token.pool || {
    pool: "",
    token0: token.id,
    token1: token.fundingToken,
    fee: 0,
    tickSpacing: 0,
    totalFTVolume: "0",
  };
  const totalSupply = Number(token.totalSupply) / 1e18;
  const token1Price = BNBPAD_PRICE;
  const marketCapInUSD = token1Price * totalSupply;
  const basePrice = 0;
  const totalFTVolume = Number(pool?.totalNothVolume || "0") / 1e18;
  const totalFTVolumeUsd = totalFTVolume * token1Price;

  const tokenDataFromDb = await Tokens.findOne({
    "basicDetails.address": tokenAddress.toLowerCase(),
  }).select("basicDetails tokenomics links walletAddress pool");

  const basicDetails = tokenDataFromDb?.basicDetails || {
    name: token.name,
    symbol: token.symbol,
    desc: "No description available",
    image: "",
    chainId: null,
    chainType: "",
  };

  const tokenomics = tokenDataFromDb?.tokenomics || {};

  const links = tokenDataFromDb?.links || {
    creatorLink: "",
    launchTweetLink: "",
    discordLink: "",
    twitterLink: "",
    telegramLink: "",
    websiteLink: "",
    twitchLink: "",
  };
  return {
    tokenData: token,
    basicDetails,
    tokenomics,
    links,
    marketCapInUSD,
    basePrice,
    totalFTVolume,
    totalFTVolumeUsd,
    pool,
  };
};

const _getDefaultTokenData = async (token: IToken): Promise<ITokenData> => {
  const defaultData: ITokenData = {
    tokenData: {
      id: token.basicDetails.address,
      name: token.basicDetails.name,
      symbol: token.basicDetails.symbol,
      totalSupply: "0",
      transactionHash: token.txHash || "",
      fundingToken: token.tokenomics.fundingTokenAddress || "",
      creator: token.walletAddress,
      graduated: false,
      reviewed: false,
      dex: token.dex || "fourmeme",
      launchRightAway: false,
      metadata: JSON.stringify({
        basicDetails: token.basicDetails,
        tokenomics: token.tokenomics,
        taxInfo: { buySellTax: 0, transferTax: 0 },
      }),
      holderCount: 0,
    },
    basicDetails: {
      name: token.basicDetails.name,
      symbol: token.basicDetails.symbol,
      desc: token.basicDetails.desc || "No description available",
      image: token.basicDetails.image || "",
      chainId: token.basicDetails.chainId,
      chainType: token.basicDetails.chainType || "",
      // isPremium: token.basicDetails.isPremium || false,
    },
    tokenomics: {
      fundingTokenAddress: token.tokenomics.fundingTokenAddress || "",
      fundingTokenDecimals: token.tokenomics.fundingTokenDecimals || 18,
      fundingTokenSymbol: token.tokenomics.fundingTokenSymbol || "",
      dex: token.tokenomics.dex || "",
      startingMC: token.tokenomics.startingMC || 0,
      endingMC: token.tokenomics.endingMC || 0,
      amountToBuy: token.tokenomics.amountToBuy || "0",
      startingTick: token.tokenomics.startingTick || 0,
      graduationTick: token.tokenomics.graduationTick || 0,
      upperMaxTick: token.tokenomics.upperMaxTick || 0,
    },
    links: {
      discordLink: token.links.discordLink || "",
      twitterLink: token.links.twitterLink || "",
      telegramLink: token.links.telegramLink || "",
      websiteLink: token.links.websiteLink || "",
      twitchLink: token.links.twitchLink || "",
      creatorLink: token.links.creatorLink || "",
      launchTweetLink: token.links.launchTweetLink || "",
    },
    marketCapInUSD: 0,
    basePrice: 0,
    totalFTVolume: 0,
    totalFTVolumeUsd: 0,
    pool: {
      token0: token.basicDetails.address,
      token1: token.tokenomics.fundingTokenAddress || "",
      fee: 0,
      tickSpacing: 0,
      pool: token.pool.pool || "",
      totalFTVolume: "0",
    },
  };
  return defaultData;
};

/**
 * Get tokens by their symbol
 * @param symbol - The symbol of the token
 * @param chainId - The chain ID of the token
 * @returns The tokens
 */
export const getTokensBySymbol = async (symbol: string, chainId: string) => {
  const tokens = await Tokens.find({
    "basicDetails.symbol": symbol,
    "basicDetails.chainId": chainId,
  });

  if (!tokens || tokens.length === 0)
    throw new NotFoundError("Tokens not found");

  return tokens;
};
