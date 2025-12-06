import nconf from "nconf";
export const blackListedTokens = ["0x0000000000000000000000000000000000000000"];
export const MAX_CAPTION_LENGTH = 100;
export const REFERRAL_POINTS = 200;

export const rateLimitWindow = 60 * 60 * 1000;
export const totalRequestsIP = 100;

export const rateLimitWindowAI = 60 * 1000;
export const totalRequestsIPAI = 60;

export const totalRequestsUser = 1;
export const TOKEN_HOLDING_THRESHOLD = 100;
export const BNBPAD_PRICE = 0.01;
export const WBNB_TOKEN = {
  address: "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c",
  symbol: "WBNB",
  image:
    "https://assets.coingecko.com/coins/images/12591/large/binance-coin-logo.png",
};
export const CHAIN_CONFIG: Record<
  number,
  {
    rpc: string;
    launchpadProxy: string;
    uiHelper: string;
    adapters: { dex: string; address: string }[];
  }
> = {
  56: {
    rpc: "https://bsc-dataseed1.bnbchain.org",
    launchpadProxy: nconf.get("LAUNCHPAD_ADDRESS_BSC"),
    uiHelper: nconf.get("UI_HELPER_ADDRESS_BSC"),
    adapters: [
      {
        dex: "",
        address: nconf.get("ADAPTER_ADDRESS_BSC"),
      },
    ],
  },
};

export type ChainID = keyof typeof CHAIN_CONFIG;

export const CHAIN_NAME: Record<number, string> = {
  1: "Ethereum",
  56: "Bsc",
};

export const KARMA_OFFSET = 1;
export const KARMA_WEIGHTS = {
  wTwitterFollowers: 1.0,
  wTwitterProfileAge: 0.6,
  wTwitterTotalTweets: 0.8,

  wWalletBalance: 1.0,
  wWalletTVF: 0.8,
  wWalletAge: 0.6,

  wUpvotesReceived: 1.2,
  wCommentsMade: 0.8,
  wTokensCreated: 1.0,
  wSiteFollowers: 1.0,

  wUserAccountAge: 0.7,

  wReferral: 1.1,
};

export const checkPrompt = `{
    "category": "Explicit Nudity" | "Violence/Gore" | "Safe",
    "severity": 1-10,
    "explanation": "short explanation here"
  }

  Definitions:
  - "Explicit Nudity" includes any sexually explicit language or nudity.
  - "Violence/Gore" includes blood, mutilation, threats, or graphic violent language.
  - "Safe" means none of the above is present.

  Respond only with JSON inside a code block.`;
