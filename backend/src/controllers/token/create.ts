import { AIThesisModel, IAIThesis } from "../../database/aiThesis";
import { IToken, Tokens } from "../../database/token";
import { ICreateFourMemeToken, ICreateToken } from "./types";
import { CHAIN_CONFIG, ChainID } from "../../utils/constant";
import {
  getPoolDetailsFromCreateTx,
  getFourMemeTokenDetailsFromTx,
  getTokenInfoFromTokenManagerV2,
  getERC20TokenDetails,
} from "../../utils/contract";

import { BadRequestError } from "../../errors";
import axios from "axios";
import { AIDecisions } from "src/database/AIDecison";

/**
 * Validate the token creation
 * @param data - The data of the token
 * @throws BadRequestError if the data is invalid
 */
export const validateTokenCreation = async (
  data: ICreateToken,
  dex?: string
) => {
  const { basicDetails, tokenomics, links, txHash, walletAddress } = data;

  try {
    if (await Tokens.exists({ "basicDetails.address": basicDetails.address }))
      throw new BadRequestError("Token address already exists");

    if (!txHash) throw new BadRequestError("Invalid body: txHash is required");
    if (!CHAIN_CONFIG[basicDetails.chainId])
      throw new BadRequestError("Unsupported chain ID");
    if (!basicDetails || !tokenomics || !links)
      throw new BadRequestError("Invalid body");
    if (!basicDetails.address)
      throw new BadRequestError("Token address not found");
    if (!walletAddress) throw new BadRequestError("Wallet address is required");

    if (!tokenomics.creatorAllocation) {
      tokenomics.creatorAllocation = 1;
    }

    const { aiThesis: _aiThesis, ...tokenDataWithoutAiThesis } = data;
    const tokenData: IToken = {
      ...tokenDataWithoutAiThesis,
      walletAddress,
      dex: (dex as "pancake" | "fourmeme") || "pancake",
    };
    await Tokens.validate(tokenData);
  } catch (error) {
    throw new BadRequestError(
      error instanceof Error ? error.message : "Invalid body"
    );
  }
};

export const createToken = async (
  body: ICreateToken & { apiKey?: string; apiSecret?: string }
) => {
  const { basicDetails, tokenomics, links, txHash, aiThesis, walletAddress } =
    body;

  if (!basicDetails || !tokenomics || !links || !txHash || !aiThesis) {
    throw new BadRequestError("Invalid body");
  }
  if (basicDetails.desc.length > 280) {
    throw new BadRequestError(
      "Invalid body: description cannot be more than 280 characters"
    );
  }
  if (basicDetails.name.length > 20) {
    throw new BadRequestError(
      "Invalid body: name cannot be more than 20 characters"
    );
  }
  if (basicDetails.symbol.length > 10) {
    throw new BadRequestError(
      "Invalid body: symbol cannot be more than 10 characters"
    );
  }

  const { pool, dex, token } = await getPoolDetailsFromCreateTx(
    txHash,
    basicDetails.chainId
  );
  const normalizedTokenAddress = token.toLowerCase();
  basicDetails.address = normalizedTokenAddress;
  tokenomics.dex = dex;

  const newToken = await Tokens.create({
    dex,
    basicDetails,
    tokenomics,
    links,
    walletAddress,
    txHash,
    pool,
  });

  await AIThesisModel.create({
    ...aiThesis,
    tokenAddress: normalizedTokenAddress,
    chainId: basicDetails.chainId,
  });

  return {
    tokenId: newToken.id,
    tokenAddress: basicDetails.address,
    imgUrl: basicDetails.image,
    chainId: basicDetails.chainId,
    message: "Token created successfully",
  };
};

export const createFourMemeToken = async (
  body: ICreateFourMemeToken,
  accessToken: string
) => {
  try {
    const response = await axios.post(
      "https://four.meme/meme-api/v1/private/token/create",
      body,
      {
        headers: {
          "Content-Type": "application/json",
          "meme-web-access": accessToken,
        },
      }
    );
    console.log("create four meme token response", response.data);
    return response.data;
  } catch (error) {
    console.log((error as any).response.data);
    console.error("Error creating Four Meme token:", error);
    throw new BadRequestError("Failed to create Four Meme token", error);
  }
};

export const saveFourMemeToken = async (
  body: ICreateFourMemeToken & {
    txHash: string;
    chainId?: number;
    aiThesis?: IAIThesis;
  }
) => {
  try {
    console.log("save four meme token body", body);
    console.log("save four meme token chainId", body.chainId);
    console.log("save four meme token txHash", body.txHash);
    console.log("save four meme token aiThesis", body.aiThesis);
    const chainId = (body.chainId || 56) as ChainID;

    if (!CHAIN_CONFIG[chainId]) {
      throw new BadRequestError("Unsupported chain ID");
    }

    const {
      token: tokenAddress,
      creator,
      dex,
    } = await getFourMemeTokenDetailsFromTx(body.txHash, chainId);

    const tokenInfo = await getTokenInfoFromTokenManagerV2(
      tokenAddress,
      chainId
    );

    const fundingTokenDetails = await getERC20TokenDetails(
      tokenInfo.quote,
      chainId
    );

    const tokenData: IToken = {
      dex: "fourmeme",
      basicDetails: {
        name: body.name,
        symbol: body.shortName,
        desc: body.desc || "",
        image: body.imgUrl,
        address: tokenAddress.toLowerCase(),
        chainId: chainId,
        chainType: CHAIN_CONFIG[chainId] ? "BSC" : "",
      },
      tokenomics: {
        fundingTokenAddress: tokenInfo.quote.toLowerCase(),
        fundingTokenDecimals: fundingTokenDetails.decimals,
        fundingTokenSymbol: fundingTokenDetails.symbol,
        dex,
        startingMC: null,
        endingMC: null,
        amountToBuy: null,
        startingTick: null,
        graduationTick: null,
        upperMaxTick: null,
        graduationLiquidity: null,
        tickSpacing: null,
        creatorAllocation: null,
      },
      links: {
        discordLink: body.webUrl || "",
        twitterLink: body.twitterUrl || "",
        telegramLink: body.telegramUrl || "",
        websiteLink: body.webUrl || "",
        twitchLink: "",
        creatorLink: "",
        launchTweetLink: "",
      },
      walletAddress: creator.toLowerCase(),
      txHash: body.txHash,
      pool: {
        pool: null,
        dex: dex as "fourmeme" | "pancake" | "thena" | null,
      },
    };

    const existingToken = await Tokens.findOne({
      "basicDetails.address": tokenAddress.toLowerCase(),
    });

    if (existingToken) {
      return {
        tokenId: existingToken.id,
        tokenAddress: tokenAddress.toLowerCase(),
        imgUrl: existingToken.basicDetails.image,
        chainId: chainId,
        message: "Token already exists",
      };
    }

    const newToken = await Tokens.create(tokenData);

    if (body.aiThesis) {
      await AIThesisModel.create({
        ...body.aiThesis,
        tokenAddress: tokenAddress.toLowerCase(),
        chainId: chainId,
      });

      await AIDecisions.insertOne({
        agentId: tokenAddress.toLowerCase(),
        tasks: body.aiThesis.memory,
        decision: body.aiThesis.goals,
        prompt: "",
      });
    }

    return {
      tokenId: newToken.id,
      tokenAddress: tokenAddress.toLowerCase(),
      imgUrl: body.imgUrl,
      chainId: chainId,
      message: "Four Meme token saved successfully",
    };
  } catch (error) {
    console.error("Error saving Four Meme token:", error);
    if (error instanceof BadRequestError) {
      throw error;
    }
    throw new BadRequestError("Failed to save Four Meme token", error);
  }
};
