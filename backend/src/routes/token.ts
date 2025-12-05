import { Router } from "express";
import rateLimit from "express-rate-limit";
import {
  getToken,
  listTokensController,
  searchData,
  uploadImage,
  createToken,
  getDailyTokenInfo,
  SortOption,
  validateTokenCreation,
  ICreateToken,
  getTokensBySymbol,
  getTokenDetails,
  uploadFormemeImage,
  createFourMemeToken,
  saveFourMemeToken,
} from "../controllers/token";
import { localUpload } from "../utils/multer";
import { totalRequestsIP, rateLimitWindow } from "../utils/constant";
import { BadRequestError } from "../errors";
import {
  cacheJsonMiddleware,
  IResponseCached,
} from "../middlewares/cacheJsonMiddleware";
import { downloadAiThesis } from "../controllers/token/aiThesis";
import { OpenAIDecisionEngine } from "../controllers/ai-models/OpenAIDecisionEngine";

const router = Router();
const decisionEngine = new OpenAIDecisionEngine();

const ipLimiter = rateLimit({
  windowMs: rateLimitWindow,
  max: totalRequestsIP,
  message: {
    success: false,
    message: "Too many requests from this IP, please try again after an hour",
  },
});

/**
 * @swagger
 * /token/dailyInfo:
 *   get:
 *     summary: Get daily token information
 *     description: Retrieves daily information about tokens including token of the day and aggregated FT volume for a specific chain. The token of the day is selected based on overall market activity.
 *     tags:
 *       - Token
 *     parameters:
 *       - in: query
 *         name: chainId
 *         required: true
 *         schema:
 *           type: integer
 *           enum: [56]
 *         description: The chain ID to fetch token information for (only BSC chain supported)
 *     responses:
 *       200:
 *         description: Successfully retrieved daily token information
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates if the request was successful
 *                 data:
 *                   type: object
 *                   properties:
 *                     tokenOfTheDay:
 *                       type: object
 *                       description: Information about the token of the day, selected based on overall market activity
 *                       properties:
 *                         basicDetails:
 *                           type: object
 *                           description: Basic information about the token
 *                           properties:
 *                             name:
 *                               type: string
 *                               description: Name of the token
 *                             symbol:
 *                               type: string
 *                               description: Symbol of the token
 *                             address:
 *                               type: string
 *                               pattern: '^0x[a-fA-F0-9]{40}$'
 *                               description: Contract address of the token in checksum format
 *                             chainId:
 *                               type: integer
 *                               enum: [56]
 *                               description: Chain ID where the token exists (only BSC chain supported)
 *                         usdMarketCap:
 *                           type: number
 *                           description: Current market capitalization in USD
 *                         totalFTVolume:
 *                           type: number
 *                           description: Total FT volume recorded for this token
 *                         totalFTVolumeUsd:
 *                           type: number
 *                           description: Total FT volume converted to USD using the fixed FT price
 *                     totalFTVolumeUsd:
 *                       type: number
 *                       description: Total FT volume across the chain converted to USD
 *       400:
 *         description: Invalid chainId provided
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: Invalid chainId
 *       500:
 *         description: Internal server error
 */
router.get(
  "/dailyInfo",
  cacheJsonMiddleware(5),
  async (req, res: IResponseCached) => {
    const chainId = req.query.chainId as string;
    const data = await getDailyTokenInfo(chainId);
    res.jsonCached({ success: true, data });
  }
);

/**
 * @swagger
 * /token/getAllTokens:
 *   get:
 *     summary: List all tokens
 *     description: Retrieves a paginated list of tokens with optional sorting and filtering. Tokens can be sorted by various metrics including market cap, creation date, last activity, and trading volume.
 *     tags:
 *       - Token
 *     parameters:
 *       - in: query
 *         name: chainId
 *         required: true
 *         schema:
 *           type: integer
 *           enum: [56]
 *         description: The chain ID to fetch tokens for (only BSC chain supported)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 50
 *           maximum: 50
 *         description: Number of tokens to return per page (max 50)
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *           minimum: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [marketCap, createdAt, lastReply, views, totalFTVolume]
 *           default: createdAt
 *         description: Field to sort tokens by. Options include market capitalization, creation date, last reply, views, and total FT volume.
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *         description: Sort order (ascending or descending)
 *     responses:
 *       200:
 *         description: Successfully retrieved token list
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates if the request was successful
 *                 data:
 *                   type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       description: List of tokens with their details
 *                       items:
 *                         type: object
 *                         properties:
 *                           basicDetails:
 *                             type: object
 *                             description: Basic information about the token
 *                             properties:
 *                               name:
 *                                 type: string
 *                                 description: Name of the token
 *                               symbol:
 *                                 type: string
 *                                 description: Symbol of the token
 *                               address:
 *                                 type: string
 *                                 pattern: '^0x[a-fA-F0-9]{40}$'
 *                                 description: Contract address of the token in checksum format
 *                               chainId:
 *                                 type: integer
 *                                 enum: [56]
 *                                 description: Chain ID where the token exists (only BSC chain supported)
 *                               desc:
 *                                 type: string
 *                                 description: Description of the token
 *                               image:
 *                                 type: string
 *                                 description: URL of the token's image
 *                           tokenomics:
 *                             type: object
 *                             description: Token economics information
 *                             properties:
 *                               dex:
 *                                 type: string
 *                                 enum: [pancake, thena]
 *                                 description: Decentralized exchange where the token is traded (pancake or thena)
 *                               startingMC:
 *                                 type: number
 *                                 description: Starting market capitalization
 *                               endingMC:
 *                                 type: number
 *                                 description: Ending market capitalization
 *                               fundingTokenAddress:
 *                                 type: string
 *                                 pattern: '^0x[a-fA-F0-9]{40}$'
 *                                 description: Address of the funding token in checksum format
 *                               fundingTokenDecimals:
 *                                 type: number
 *                                 description: Number of decimals for the funding token
 *                               fundingTokenSymbol:
 *                                 type: string
 *                                 description: Symbol of the funding token
 *                           taxInfo:
 *                             type: object
 *                             description: Tax information for the token
 *                           taxDistribution:
 *                             type: object
 *                             description: Distribution of taxes
 *                           fees:
 *                             type: object
 *                             description: Fee structure
 *                             properties:
 *                               communityFee:
 *                                 type: number
 *                                 description: Fee percentage for community
 *                               creatorFee:
 *                                 type: number
 *                                 description: Fee percentage for creator
 *                               houseFee:
 *                                 type: number
 *                                 description: Fee percentage for house
 *                           links:
 *                             type: object
 *                             description: Social media and website links
 *                             properties:
 *                               discordLink:
 *                                 type: string
 *                                 description: Discord server link
 *                               twitterLink:
 *                                 type: string
 *                                 description: Twitter profile link
 *                               telegramLink:
 *                                 type: string
 *                                 description: Telegram group link
 *                               websiteLink:
 *                                 type: string
 *                                 description: Official website link
 *                               twitchLink:
 *                                 type: string
 *                                 description: Twitch channel link
 *                               launchTweetLink:
 *                                 type: string
 *                                 description: Link to launch announcement tweet
 *                           usdMarketCap:
 *                             type: number
 *                             description: Current market capitalization in USD
 *                           basePrice:
 *                             type: number
 *                             description: Base price of the token
 *                           totalFTVolume:
 *                             type: number
 *                             description: Total FT volume recorded for the token
 *                           totalFTVolumeUsd:
 *                             type: number
 *                             description: Total FT volume converted to USD using the fixed FT price
 *                     count:
 *                       type: integer
 *                       description: Number of tokens in the current page
 *                     page:
 *                       type: integer
 *                       description: Current page number
 *                     limit:
 *                       type: integer
 *                       description: Number of tokens per page
 *                     totalTokens:
 *                       type: integer
 *                       description: Total number of tokens available
 *       400:
 *         description: Invalid parameters provided
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: Invalid parameters
 *       500:
 *         description: Internal server error
 */
router.get(
  "/getAllTokens",
  cacheJsonMiddleware(10),
  async (req, res: IResponseCached) => {
    const { chainId, limit, page, sortBy, order } = req.query as {
      chainId: string;
      limit: string;
      page: string;
      sortBy: SortOption;
      order: "asc" | "desc";
    };
    const data = await listTokensController(
      chainId,
      parseInt(limit),
      parseInt(page),
      sortBy,
      order
    );
    res.jsonCached({ success: true, data });
  }
);

/**
 * @swagger
 * /token/getToken:
 *   get:
 *     summary: Get token details
 *     description: Retrieves detailed information about a specific token including market data, social metrics, and holder information. This endpoint also increments the view count for the token.
 *     tags:
 *       - Token
 *     parameters:
 *       - in: query
 *         name: tokenAddress
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^0x[a-fA-F0-9]{40}$'
 *         description: The token's contract address in checksum format
 *       - in: query
 *         name: chainId
 *         required: true
 *         schema:
 *           type: integer
 *           enum: [56]
 *         description: The chain ID where the token exists (only BSC chain supported)
 *     responses:
 *       200:
 *         description: Successfully retrieved token details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates if the request was successful
 *                 data:
 *                   type: object
 *                   properties:
 *                     basicDetails:
 *                       type: object
 *                       description: Basic information about the token
 *                       properties:
 *                         name:
 *                           type: string
 *                           description: Name of the token
 *                         symbol:
 *                           type: string
 *                           description: Symbol of the token
 *                         address:
 *                           type: string
 *                           pattern: '^0x[a-fA-F0-9]{40}$'
 *                           description: Contract address of the token in checksum format
 *                         chainId:
 *                           type: integer
 *                           enum: [56]
 *                           description: Chain ID where the token exists (only BSC chain supported)
 *                         desc:
 *                           type: string
 *                           description: Description of the token
 *                         image:
 *                           type: string
 *                           description: URL of the token's image
 *                     tokenomics:
 *                       type: object
 *                       description: Token economics information
 *                       properties:
 *                         dex:
 *                           type: string
 *                           enum: [pancake, thena]
 *                           description: Decentralized exchange where the token is traded (pancake or thena)
 *                         startingMC:
 *                           type: number
 *                           description: Starting market capitalization
 *                         endingMC:
 *                           type: number
 *                           description: Ending market capitalization
 *                         fundingTokenAddress:
 *                           type: string
 *                           pattern: '^0x[a-fA-F0-9]{40}$'
 *                           description: Address of the funding token in checksum format
 *                         fundingTokenDecimals:
 *                           type: number
 *                           description: Number of decimals for the funding token
 *                         fundingTokenSymbol:
 *                           type: string
 *                           description: Symbol of the funding token
 *                     taxInfo:
 *                       type: object
 *                       description: Tax information for the token
 *                     taxDistribution:
 *                       type: object
 *                       description: Distribution of taxes
 *                     fees:
 *                       type: object
 *                       description: Fee structure
 *                       properties:
 *                         communityFee:
 *                           type: number
 *                           description: Fee percentage for community
 *                         creatorFee:
 *                           type: number
 *                           description: Fee percentage for creator
 *                         houseFee:
 *                           type: number
 *                           description: Fee percentage for house
 *                     links:
 *                       type: object
 *                       description: Social media and website links
 *                       properties:
 *                         discordLink:
 *                           type: string
 *                           description: Discord server link
 *                         twitterLink:
 *                           type: string
 *                           description: Twitter profile link
 *                         telegramLink:
 *                           type: string
 *                           description: Telegram group link
 *                         websiteLink:
 *                           type: string
 *                           description: Official website link
 *                         twitchLink:
 *                           type: string
 *                           description: Twitch channel link
 *                         launchTweetLink:
 *                           type: string
 *                           description: Link to launch announcement tweet
 *                     usdMarketCap:
 *                       type: number
 *                       description: Current market capitalization in USD
 *                     basePrice:
 *                       type: number
 *                       description: Base price of the token
 *                     totalFTVolume:
 *                       type: number
 *                       description: Total FT volume recorded for the token
 *                     totalFTVolumeUsd:
 *                       type: number
 *                       description: Total FT volume converted to USD using the fixed FT price
 *                     holderCount:
 *                       type: integer
 *                       description: Number of token holders
 *                     views:
 *                       type: integer
 *                       description: Number of views on the token page
 *                     comments:
 *                       type: integer
 *                       description: Number of comments on the token page
 *       400:
 *         description: Invalid parameters provided
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: tokenAddress and chainId are required
 *       404:
 *         description: Token not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: Token not found
 *       500:
 *         description: Internal server error
 */
router.get(
  "/getToken",
  cacheJsonMiddleware(10),
  async (req, res: IResponseCached) => {
    const { tokenAddress, chainId } = req.query as {
      tokenAddress: string;
      chainId: string;
    };
    const data = await getToken(tokenAddress, chainId);
    res.jsonCached({ success: true, data });
  }
);

/**
 * @swagger
 * /token/getTokensBySymbol:
 *   get:
 *     summary: Get tokens by symbol
 *     description: |
 *       Retrieves tokens that match the provided symbol on a specific blockchain network.
 *       This endpoint:
 *       - Searches for tokens with the exact symbol match
 *       - Returns basic token information including name, address, and market data
 *       - Supports filtering by chain ID
 *     tags:
 *       - Token
 *     parameters:
 *       - in: query
 *         name: symbol
 *         required: true
 *         schema:
 *           type: string
 *         description: |
 *           The token symbol to search for.
 *           Example: "BTC", "ETH", "USDT"
 *       - in: query
 *         name: chainId
 *         required: true
 *         schema:
 *           type: string
 *         description: |
 *           The blockchain network ID to search tokens in.
 *           Example: "1" for Ethereum Mainnet, "56" for BSC
 *     responses:
 *       200:
 *         description: Successfully retrieved tokens
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       basicDetails:
 *                         type: object
 *                         description: Basic information about the token
 *                         properties:
 *                           name:
 *                             type: string
 *                             description: Name of the token
 *                             example: "Bitcoin"
 *                           symbol:
 *                             type: string
 *                             description: Symbol of the token
 *                             example: "BTC"
 *                           address:
 *                             type: string
 *                             description: Contract address of the token
 *                             example: "0x1234...5678"
 *                           chainId:
 *                             type: number
 *                             description: Chain ID where the token exists
 *                             example: 1
 *                           desc:
 *                             type: string
 *                             description: Description of the token
 *                             example: "The first decentralized cryptocurrency"
 *                           image:
 *                             type: string
 *                             description: URL to the token's image/logo
 *                             example: "https://example.com/token.png"
 *                       usdMarketCap:
 *                         type: number
 *                         description: Current market capitalization in USD
 *                         example: 1000000000
 *                       basePrice:
 *                         type: number
 *                         description: Base price of the token
 *                         example: 50000
 *                       totalFTVolume:
 *                         type: number
 *                         description: Total FT volume recorded for tokens matching the symbol
 *                         example: 5000000
 *                       totalFTVolumeUsd:
 *                         type: number
 *                         description: Total FT volume converted to USD using the fixed FT price
 *                         example: 50000
 *       400:
 *         description: |
 *           Bad Request - Invalid parameters provided
 *           Possible reasons:
 *           - Missing required parameters
 *           - Invalid chain ID
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "Invalid parameters"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "Internal server error"
 */
router.get(
  "/getTokensBySymbol",
  cacheJsonMiddleware(10),
  async (req, res: IResponseCached) => {
    const { symbol, chainId } = req.query as {
      symbol: string;
      chainId: string;
    };
    const data = await getTokensBySymbol(symbol, chainId);
    res.jsonCached({ success: true, data });
  }
);

/**
 * @swagger
 * /token/search:
 *   get:
 *     summary: Search tokens
 *     description: |
 *       Searches for tokens on a specific blockchain network.
 *       This endpoint:
 *       - Fetches token data from the subgraph
 *       - Returns a list of tokens with their basic details, tokenomics, and social links
 *       - Includes market data and trading information
 *       - Returns tokens sorted by creation date (newest first)
 *     tags:
 *       - Token
 *     parameters:
 *       - in: query
 *         name: chainId
 *         required: true
 *         schema:
 *           type: string
 *         description: |
 *           The blockchain network ID to search tokens in.
 *           Example: "1" for Ethereum Mainnet, "56" for BSC
 *     responses:
 *       200:
 *         description: Successfully retrieved search results
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       basicDetails:
 *                         type: object
 *                         description: Basic information about the token
 *                         properties:
 *                           name:
 *                             type: string
 *                             description: Name of the token
 *                             example: "Example Token"
 *                           symbol:
 *                             type: string
 *                             description: Symbol of the token
 *                             example: "EXM"
 *                           address:
 *                             type: string
 *                             description: Contract address of the token
 *                             example: "0x1234...5678"
 *                           chainId:
 *                             type: number
 *                             description: Chain ID where the token exists
 *                             example: 1
 *                           desc:
 *                             type: string
 *                             description: Description of the token
 *                             example: "A revolutionary token for the future"
 *                           image:
 *                             type: string
 *                             description: URL to the token's image/logo
 *                             example: "https://example.com/token.png"
 *                       tokenomics:
 *                         type: object
 *                         description: Token economics information
 *                         properties:
 *                           dex:
 *                             type: string
 *                             description: Decentralized exchange where the token is traded
 *                             example: "Uniswap V2"
 *                           startingMC:
 *                             type: number
 *                             description: Starting market capitalization
 *                             example: 1000000
 *                           endingMC:
 *                             type: number
 *                             description: Ending market capitalization
 *                             example: 5000000
 *                           fundingTokenAddress:
 *                             type: string
 *                             description: Address of the funding token
 *                             example: "0x1234...5678"
 *                           fundingTokenDecimals:
 *                             type: number
 *                             description: Number of decimals for the funding token
 *                             example: 18
 *                           fundingTokenSymbol:
 *                             type: string
 *                             description: Symbol of the funding token
 *                             example: "USDT"
 *                       taxInfo:
 *                         type: object
 *                         description: Tax information for the token
 *                         properties:
 *                           buyTax:
 *                             type: number
 *                             description: Buy tax percentage
 *                             example: 5
 *                           sellTax:
 *                             type: number
 *                             description: Sell tax percentage
 *                             example: 5
 *                       taxDistribution:
 *                         type: object
 *                         description: Distribution of tax revenue
 *                         properties:
 *                           community:
 *                             type: number
 *                             description: Percentage allocated to community
 *                             example: 50
 *                           creator:
 *                             type: number
 *                             description: Percentage allocated to creator
 *                             example: 30
 *                           house:
 *                             type: number
 *                             description: Percentage allocated to house
 *                             example: 20
 *                       fees:
 *                         type: object
 *                         description: Fee structure
 *                         properties:
 *                           communityFee:
 *                             type: number
 *                             description: Fee percentage for community
 *                             example: 1
 *                           creatorFee:
 *                             type: number
 *                             description: Fee percentage for creator
 *                             example: 1
 *                           houseFee:
 *                             type: number
 *                             description: Fee percentage for house
 *                             example: 1
 *                       links:
 *                         type: object
 *                         description: Social media and website links
 *                         properties:
 *                           discordLink:
 *                             type: string
 *                             description: Discord server link
 *                             example: "https://discord.gg/example"
 *                           twitterLink:
 *                             type: string
 *                             description: Twitter profile link
 *                             example: "https://twitter.com/example"
 *                           telegramLink:
 *                             type: string
 *                             description: Telegram group link
 *                             example: "https://t.me/example"
 *                           websiteLink:
 *                             type: string
 *                             description: Official website link
 *                             example: "https://example.com"
 *                           twitchLink:
 *                             type: string
 *                             description: Twitch channel link
 *                             example: "https://twitch.tv/example"
 *                           launchTweetLink:
 *                             type: string
 *                             description: Link to launch announcement tweet
 *                             example: "https://twitter.com/example/status/123456789"
 *       400:
 *         description: |
 *           Bad Request - Invalid parameters provided
 *           Possible reasons:
 *           - Missing chainId parameter
 *           - Invalid chain ID
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "Invalid chain ID"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "Internal server error"
 */
router.get(
  "/search",
  cacheJsonMiddleware(1),
  async (req, res: IResponseCached) => {
    const { chainId } = req.query as { chainId: string };
    const data = await searchData(chainId);
    res.jsonCached({ success: true, data });
  }
);

/**
 * @swagger
 * /token/create:
 *   post:
 *     summary: Create a new token
 *     description: Creates a new token with the provided details
 *     tags:
 *       - Token
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               basicDetails:
 *                 type: object
 *                 description: Basic information about the token
 *                 properties:
 *                   chainId:
 *                     type: integer
 *                     enum: [56]
 *                     description: The blockchain network ID where the token will be created (only BSC chain supported)
 *                   chainType:
 *                     type: string
 *                     enum: ['evm']
 *                     description: The type of blockchain (currently only EVM chains supported)
 *                   name:
 *                     type: string
 *                     description: Name of the token
 *                   address:
 *                     type: string
 *                     pattern: '^0x[a-fA-F0-9]{40}$'
 *                     description: Contract address of the token in checksum format
 *                   symbol:
 *                     type: string
 *                     description: Symbol of the token
 *                   desc:
 *                     type: string
 *                     description: Description of the token
 *                   isPremium:
 *                     type: boolean
 *                     description: Whether this is a premium token
 *                   image:
 *                     type: string
 *                     description: URL of the token's image
 *               tokenomics:
 *                 type: object
 *                 description: Token economics information
 *                 properties:
 *                   dex:
 *                     type: string
 *                     enum: [pancake, thena]
 *                     description: Decentralized exchange where the token will be traded (pancake or thena)
 *                   startingMC:
 *                     type: number
 *                     description: Starting market capitalization
 *                   endingMC:
 *                     type: number
 *                     description: Ending market capitalization
 *                   fundingTokenAddress:
 *                     type: string
 *                     pattern: '^0x[a-fA-F0-9]{40}$'
 *                     description: Address of the funding token in checksum format
 *                   fundingTokenDecimals:
 *                     type: number
 *                     description: Number of decimals for the funding token
 *                   fundingTokenSymbol:
 *                     type: string
 *                     description: Symbol of the funding token
 *                   amountToBuy:
 *                     type: string
 *                     description: Amount of tokens to buy
 *                   startingTick:
 *                     type: number
 *                     description: Starting tick for the token
 *                   graduationTick:
 *                     type: number
 *                     description: Graduation tick for the token
 *                   upperMaxTick:
 *                     type: number
 *                     description: Upper maximum tick for the token
 *               walletAddress:
 *                 type: string
 *                 pattern: '^0x[a-fA-F0-9]{40}$'
 *                 description: Optional wallet address of the token creator in checksum format
 *               links:
 *                 type: object
 *                 description: Social media and website links
 *                 properties:
 *                   discordLink:
 *                     type: string
 *                     description: Discord server link
 *                   twitterLink:
 *                     type: string
 *                     description: Twitter profile link
 *                   telegramLink:
 *                     type: string
 *                     description: Telegram group link
 *                   websiteLink:
 *                     type: string
 *                     description: Official website link
 *                   twitchLink:
 *                     type: string
 *                     description: Twitch channel link
 *                   launchTweetLink:
 *                     type: string
 *                     description: Link to launch announcement tweet
 *               txHash:
 *                 type: string
 *                 pattern: '^0x[a-fA-F0-9]{64}$'
 *                 description: Transaction hash of the token creation in hex format
 *               pool:
 *                 type: object
 *                 description: Pool information
 *                 properties:
 *                   pool:
 *                     type: string
 *                     pattern: '^0x[a-fA-F0-9]{40}$'
 *                     description: Pool address in checksum format
 *                   dex:
 *                     type: string
 *                     enum: [pancake, thena]
 *                     description: Decentralized exchange name (pancake or thena)
 *     responses:
 *       200:
 *         description: Successfully created token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates if the request was successful
 *                 data:
 *                   type: object
 *                   properties:
 *                     tokenId:
 *                       type: string
 *                       description: The unique identifier of the created token
 *                     tokenAddress:
 *                       type: string
 *                       pattern: '^0x[a-fA-F0-9]{40}$'
 *                       description: The contract address of the created token in checksum format
 *                     imgUrl:
 *                       type: string
 *                       description: URL of the token's image
 *                     chainId:
 *                       type: integer
 *                       enum: [56]
 *                       description: The chain ID where the token was created (only BSC chain supported)
 *                     message:
 *                       type: string
 *                       description: Success message
 *       401:
 *         description: Unauthorized - Authentication required
 *       400:
 *         description: Invalid token data provided
 *       500:
 *         description: Internal server error
 */
router.post("/create", async (req, res) => {
  const tokenData = req.body;
  const data = await createToken(tokenData);
  res.json({ success: true, data });
});

/**
 * @swagger
 * /token/validate-create:
 *   post:
 *     summary: Validate token creation data
 *     description: Validates the token creation data before actual creation
 *     tags:
 *       - Token
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               basicDetails:
 *                 type: object
 *                 description: Basic information about the token
 *                 properties:
 *                   chainId:
 *                     type: integer
 *                     enum: [56]
 *                     description: The blockchain network ID where the token will be created (only BSC chain supported)
 *                   chainType:
 *                     type: string
 *                     enum: ['evm']
 *                     description: The type of blockchain (currently only EVM chains supported)
 *                   name:
 *                     type: string
 *                     description: Name of the token
 *                   address:
 *                     type: string
 *                     pattern: '^0x[a-fA-F0-9]{40}$'
 *                     description: Contract address of the token in checksum format
 *                   symbol:
 *                     type: string
 *                     description: Symbol of the token
 *                   desc:
 *                     type: string
 *                     description: Description of the token
 *                   isPremium:
 *                     type: boolean
 *                     description: Whether this is a premium token
 *                   image:
 *                     type: string
 *                     description: URL of the token's image
 *               tokenomics:
 *                 type: object
 *                 description: Token economics information
 *                 properties:
 *                   dex:
 *                     type: string
 *                     enum: [pancake, thena]
 *                     description: Decentralized exchange where the token will be traded (pancake or thena)
 *                   startingMC:
 *                     type: number
 *                     description: Starting market capitalization
 *                   endingMC:
 *                     type: number
 *                     description: Ending market capitalization
 *                   fundingTokenAddress:
 *                     type: string
 *                     pattern: '^0x[a-fA-F0-9]{40}$'
 *                     description: Address of the funding token in checksum format
 *                   fundingTokenDecimals:
 *                     type: number
 *                     description: Number of decimals for the funding token
 *                   fundingTokenSymbol:
 *                     type: string
 *                     description: Symbol of the funding token
 *                   amountToBuy:
 *                     type: string
 *                     description: Amount of tokens to buy
 *                   startingTick:
 *                     type: number
 *                     description: Starting tick for the token
 *                   graduationTick:
 *                     type: number
 *                     description: Graduation tick for the token
 *                   upperMaxTick:
 *                     type: number
 *                     description: Upper maximum tick for the token
 *               walletAddress:
 *                 type: string
 *                 pattern: '^0x[a-fA-F0-9]{40}$'
 *                 description: Optional wallet address of the token creator in checksum format
 *               links:
 *                 type: object
 *                 description: Social media and website links
 *                 properties:
 *                   discordLink:
 *                     type: string
 *                     description: Discord server link
 *                   twitterLink:
 *                     type: string
 *                     description: Twitter profile link
 *                   telegramLink:
 *                     type: string
 *                     description: Telegram group link
 *                   websiteLink:
 *                     type: string
 *                     description: Official website link
 *                   twitchLink:
 *                     type: string
 *                     description: Twitch channel link
 *                   launchTweetLink:
 *                     type: string
 *                     description: Link to launch announcement tweet
 *               txHash:
 *                 type: string
 *                 pattern: '^0x[a-fA-F0-9]{64}$'
 *                 description: Transaction hash of the token creation in hex format
 *               pool:
 *                 type: object
 *                 description: Pool information
 *                 properties:
 *                   pool:
 *                     type: string
 *                     pattern: '^0x[a-fA-F0-9]{40}$'
 *                     description: Pool address in checksum format
 *                   dex:
 *                     type: string
 *                     enum: [pancake, thena]
 *                     description: Decentralized exchange name (pancake or thena)
 *     responses:
 *       200:
 *         description: Token data is valid
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates if the request was successful
 *                 data:
 *                   type: object
 *                   properties:
 *                     isValid:
 *                       type: boolean
 *                       description: Whether the token data is valid
 *                     message:
 *                       type: string
 *                       description: Validation message
 *       401:
 *         description: Unauthorized - Authentication required
 *       400:
 *         description: Invalid token data provided
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   description: Error message
 *                   example: "Token address already exists"
 *       500:
 *         description: Internal server error
 */
router.post("/validate-create", async (req, res) => {
  const tokenData = req.body as ICreateToken;
  const data = await validateTokenCreation(tokenData);
  res.json({ success: true, data });
});

/**
 * @swagger
 * /token/moderateContent:
 *   post:
 *     summary: Moderate content
 *     description: Checks if the provided content is safe/appropriate
 *     tags:
 *       - Token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *                 description: The content to be moderated
 *     responses:
 *       200:
 *         description: Content moderation result
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates if the request was successful
 *                 data:
 *                   type: object
 *                   properties:
 *                     isContentSafe:
 *                       type: boolean
 *                       description: Whether the content is safe/appropriate
 *       400:
 *         description: Invalid content provided
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /token/uploadImage:
 *   post:
 *     summary: Upload token image
 *     description: Uploads and processes an image for a token
 *     tags:
 *       - Token
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               images:
 *                 type: string
 *                 format: binary
 *                 description: The image file to upload
 *     responses:
 *       200:
 *         description: Successfully uploaded image
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates if the request was successful
 *                 message:
 *                   type: string
 *                   description: Success message
 *                 image:
 *                   type: string
 *                   description: URL of the uploaded image
 *       401:
 *         description: Unauthorized - Authentication required
 *       400:
 *         description: No image file provided or inappropriate content detected
 *       500:
 *         description: Internal server error
 */
router.post(
  "/uploadImage",
  ipLimiter,
  localUpload.single("images"),
  async (req, res) => {
    if (!req.file) throw new BadRequestError("No image file provided");
    const data = await uploadImage(req.file);
    res.json({ success: true, data });
  }
);

/**
 * @swagger
 * /token/getTokenDetails:
 *   get:
 *     summary: Get token details
 *     description: Retrieves detailed information about a specific token
 *     tags:
 *       - Token
 *     parameters:
 *       - in: query
 *         name: chainId
 *         required: true
 *         description: The chain ID of the token
 *       - in: query
 *         name: symbol
 *         required: true
 *         description: The symbol of the token
 *     responses:
 *       200:
 *         description: Successfully retrieved token details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates if the request was successful
 *                 data:
 *                   type: object
 *                   description: Token details
 *       500:
 *         description: Internal server error
 */
router.get(
  "/getTokenDetails",
  cacheJsonMiddleware(10),
  async (req, res: IResponseCached) => {
    const { chainId, symbol } = req.query as {
      chainId: string;
      symbol: string;
    };
    const data = await getTokenDetails(chainId, symbol);
    res.jsonCached({ success: true, data });
  }
);

/**
 * @swagger
 * /token/getAiThesis:
 *   get:
 *     summary: Download AI thesis for a token
 *     description: Returns the stored AI thesis configuration for the specified token as a JSON attachment.
 *     tags:
 *       - Token
 *     parameters:
 *       - in: query
 *         name: tokenAddress
 *         schema:
 *           type: string
 *         required: true
 *         description: Token address whose AI thesis should be downloaded.
 *       - in: query
 *         name: chainId
 *         schema:
 *           type: string
 *         required: true
 *         description: Chain identifier for the token (e.g. 56 for BNB Chain).
 *     responses:
 *       200:
 *         description: Successfully retrieved AI thesis data.
 *         headers:
 *           Content-Disposition:
 *             schema:
 *               type: string
 *             description: Attachment filename for the AI thesis JSON file.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 tokenAddress:
 *                   type: string
 *                 chainId:
 *                   type: number
 *                 aiThesis:
 *                   type: object
 *                   description: Full AI thesis configuration for the token.
 *       400:
 *         description: Missing or invalid query parameters.
 *       404:
 *         description: AI thesis not found for the provided token and chain combination.
 *       500:
 *         description: Internal server error.
 */
router.get("/getAiThesis", async (req, res) => {
  const { tokenAddress, chainId } = req.query as {
    tokenAddress: string;
    chainId: string;
  };

  const data = await downloadAiThesis(tokenAddress, chainId);
  res.setHeader(
    "Content-Disposition",
    `attachment; filename=aiThesis_${tokenAddress}_${chainId}.json`
  );
  res.setHeader("Content-Type", "application/json");
  res.send(JSON.stringify(data, null, 2));
});

/**
 * @swagger
 * /token/trades:
 *   post:
 *     summary: Create a new trade record
 *     description: Saves a trade record with AI decision, market data, and trading parameters
 *     tags:
 *       - Token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - action
 *               - tokenAddress
 *               - symbol
 *               - amount
 *               - price
 *               - marketData
 *               - aiDecision
 *             properties:
 *               action:
 *                 type: string
 *                 enum: [BUY, SELL, HOLD]
 *                 description: The trading action
 *               tokenAddress:
 *                 type: string
 *                 pattern: '^0x[a-fA-F0-9]{40}$'
 *                 description: The token contract address
 *               symbol:
 *                 type: string
 *                 description: The token symbol
 *               amount:
 *                 type: number
 *                 description: The trade amount
 *               price:
 *                 type: number
 *                 description: The trade price
 *               prompt:
 *                 type: string
 *                 description: The prompt used for AI analysis
 *               reasoning:
 *                 type: string
 *                 description: The reasoning behind the trade decision
 *               confidence:
 *                 type: number
 *                 minimum: 0
 *                 maximum: 100
 *                 description: Confidence level (0-100)
 *               riskLevel:
 *                 type: string
 *                 enum: [HIGH, MEDIUM, LOW]
 *                 description: Risk level assessment
 *               positionSize:
 *                 type: number
 *                 description: Recommended position size
 *               stopLoss:
 *                 type: number
 *                 description: Stop loss price
 *               takeProfit:
 *                 type: number
 *                 description: Take profit price
 *               marketConditions:
 *                 type: array
 *                 items:
 *                   type: string
 *                   enum: [LOW_LIQUIDITY, HIGH_MOMENTUM, BULLISH_SENTIMENT, BEARISH_SENTIMENT, HIGH_VOLATILITY, STABLE]
 *                 description: Market conditions array
 *               aiDecision:
 *                 type: object
 *                 required:
 *                   - action
 *                   - confidence
 *                   - reasoning
 *                   - riskLevel
 *                   - positionSize
 *                 properties:
 *                   action:
 *                     type: string
 *                     enum: [BUY, SELL, HOLD]
 *                   confidence:
 *                     type: number
 *                     minimum: 0
 *                     maximum: 100
 *                   reasoning:
 *                     type: string
 *                   riskLevel:
 *                     type: string
 *                     enum: [HIGH, MEDIUM, LOW]
 *                   positionSize:
 *                     type: number
 *               marketData:
 *                 type: object
 *                 required:
 *                   - token
 *                   - price
 *                   - volume24h
 *                   - marketCap
 *                   - priceChange24h
 *                   - volatility
 *                   - liquidity
 *                   - sentiment
 *                   - technicalIndicators
 *                 properties:
 *                   token:
 *                     type: string
 *                   price:
 *                     type: number
 *                   volume24h:
 *                     type: number
 *                   marketCap:
 *                     type: number
 *                   priceChange24h:
 *                     type: number
 *                   volatility:
 *                     type: number
 *                   liquidity:
 *                     type: number
 *                   sentiment:
 *                     type: string
 *                     enum: [bullish, bearish, neutral]
 *                   technicalIndicators:
 *                     type: object
 *                     properties:
 *                       rsi:
 *                         type: number
 *                       macd:
 *                         type: number
 *                       movingAverage20:
 *                         type: number
 *                       movingAverage50:
 *                         type: number
 *               transactionFrom:
 *                 type: string
 *                 pattern: '^0x[a-fA-F0-9]{40}$'
 *                 description: The wallet address that initiated the transaction
 *               status:
 *                 type: string
 *                 enum: [pending, completed, failed, cancelled]
 *                 default: pending
 *                 description: Trade status
 *               timestamp:
 *                 type: number
 *                 description: Unix timestamp in milliseconds
 *               gasUsed:
 *                 type: string
 *                 description: Gas used for the transaction
 *               transactionHash:
 *                 type: string
 *                 description: Transaction hash
 *     responses:
 *       200:
 *         description: Successfully created trade record
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   description: The created trade document
 *       400:
 *         description: Bad request - Invalid trade data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "Missing required fields"
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /token/uploadTokenImageFourMeme:
 *   post:
 *     summary: Upload a token image to Four Meme
 *     description: Accepts a multipart image file and forwards it to the Four Meme `/v1/private/token/upload` endpoint.
 *     tags:
 *       - Token
 *     parameters:
 *       - in: header
 *         name: meme-web-access
 *         schema:
 *           type: string
 *         required: true
 *         description: Access token obtained from the Four Meme login flow.
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - images
 *             properties:
 *               images:
 *                 type: string
 *                 format: binary
 *                 description: Image file to upload (jpeg, png, gif, bmp, or webp).
 *     responses:
 *       200:
 *         description: Successfully uploaded image.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: string
 *                   description: URL of the uploaded image returned by Four Meme.
 *       400:
 *         description: Missing image file or access token.
 *       401:
 *         description: Authentication required.
 *       500:
 *         description: Upstream service error.
 */
router.post(
  "/uploadTokenImageFourMeme",
  localUpload.single("images"),
  async (req, res) => {
    if (!req.file) throw new BadRequestError("No image file provided");

    const data = await uploadFormemeImage(
      req.file,
      req.headers["meme-web-access"] as string
    );
    res.json({ data });
  }
);

/**
 * @swagger
 * /token/createFourMemeToken:
 *   post:
 *     summary: Create a Four Meme token
 *     description: Proxies the request to the Four Meme `/v1/private/token/create` endpoint and returns the upstream response.
 *     tags:
 *       - Token
 *     parameters:
 *       - in: header
 *         name: meme-web-access
 *         schema:
 *           type: string
 *         required: true
 *         description: Access token obtained from the Four Meme login flow.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - shortName
 *               - desc
 *               - imgUrl
 *               - launchTime
 *               - label
 *               - lpTradingFee
 *               - preSale
 *               - totalSupply
 *               - raisedAmount
 *               - saleRate
 *               - reserveRate
 *               - funGroup
 *               - clickFun
 *               - symbol
 *             properties:
 *               name:
 *                 type: string
 *                 description: Token name.
 *               shortName:
 *                 type: string
 *                 description: Token symbol/ticker.
 *               desc:
 *                 type: string
 *                 description: Token description.
 *               imgUrl:
 *                 type: string
 *                 format: uri
 *                 description: URL of the uploaded token image hosted on Four Meme.
 *               launchTime:
 *                 type: number
 *                 format: int64
 *                 description: Launch timestamp in milliseconds.
 *               label:
 *                 type: string
 *                 enum: [Meme, AI, Defi, Games, Infra, De-Sci, Social, Depin, Charity, Others]
 *                 description: Platform-supported token category.
 *               lpTradingFee:
 *                 type: number
 *                 example: 0.0025
 *                 description: Trading fee rate (fixed at 0.0025).
 *               webUrl:
 *                 type: string
 *                 format: uri
 *                 description: Project website URL.
 *               twitterUrl:
 *                 type: string
 *                 format: uri
 *                 description: Project Twitter/X URL.
 *               telegramUrl:
 *                 type: string
 *                 format: uri
 *                 description: Project Telegram URL.
 *               preSale:
 *                 type: string
 *                 description: Presale amount in BNB; use "0" if no presale.
 *               onlyMPC:
 *                 type: boolean
 *                 description: Whether to create a token in X Mode.
 *               totalSupply:
 *                 type: number
 *                 example: 1000000000
 *                 description: Total token supply (fixed at 1,000,000,000).
 *               raisedAmount:
 *                 type: number
 *                 example: 24
 *                 description: Raised amount in BNB (fixed at 24).
 *               saleRate:
 *                 type: number
 *                 example: 0.8
 *                 description: Sale ratio (fixed at 0.8).
 *               reserveRate:
 *                 type: number
 *                 example: 0
 *                 description: Reserved ratio (fixed at 0).
 *               funGroup:
 *                 type: boolean
 *                 description: Fixed parameter; must be false.
 *               clickFun:
 *                 type: boolean
 *                 description: Fixed parameter; must be false.
 *               symbol:
 *                 type: string
 *                 example: BNB
 *                 description: Base currency symbol (fixed as BNB).
 *     responses:
 *       200:
 *         description: Token creation parameters returned by Four Meme.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   description: Upstream API response containing `createArg`, `signature`, and related metadata.
 *       400:
 *         description: Invalid request body or missing access token.
 *       401:
 *         description: Authentication required.
 *       500:
 *         description: Upstream service error.
 */
router.post("/createFourMemeToken", async (req, res) => {
  const body = req.body;
  const data = await createFourMemeToken(
    body,
    req.headers["meme-web-access"] as string
  );
  res.json({ data });
});

router.post("/saveFourMemeToken", async (req, res) => {
  const body = req.body;
  const data = await saveFourMemeToken(body);
  res.json({ success: true, data });
});

export default router;
