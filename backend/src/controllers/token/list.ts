import { Tokens } from "../../database/token";
import { BadRequestError } from "../../errors";

export type SortOption =
  | "marketCap"
  | "createdAt"
  | "lastReply"
  | "views"
  | "totalFTVolume";

export const searchData = async (chainId: string) => {
  if (!chainId || isNaN(Number(chainId))) {
    throw new BadRequestError("Invalid or unsupported chainId / graph");
  }

  const tokensInDB = await Tokens.find({
    "basicDetails.chainId": Number(chainId),
  }).select("basicDetails walletAddress tokenomics links createdAt");

  return tokensInDB.map((token) => {
    return {
      basicDetails: token.basicDetails,
      tokenomics: token.tokenomics || {},
      links: token.links || {},
      createdAt: token.createdAt
        ? Math.floor(new Date(token?.createdAt).getTime() / 1000)
        : 0,
    };
  });
};
