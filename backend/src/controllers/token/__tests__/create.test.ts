import { Tokens } from '../../../database/token';
import { createToken } from '../create';
import { BadRequestError } from '../../../errors';
import { getPoolDetailsFromCreateTx } from '../../../utils/contract';
// import { formatAndSendTelegramMessage } from '../../notify-bot/telegram';
// import { formatAndSendTweet } from '../../notify-bot/twitter';
import { IUserModel, Users } from '../../../database/user';
import { ICreateToken } from '../types';

// Mock dependencies
jest.mock('../../../utils/contract', () => ({
  getPoolDetailsFromCreateTx: jest.fn(),
}));

jest.mock('../../../controllers/ai-models/createAIComments', () => ({
  generateComment: jest.fn(),
}));

jest.mock('../../ai-models/contentModetration', () => ({
  isContentClean: jest.fn(),
}));

// Mock data
const mockTokenData: ICreateToken = {
  basicDetails: {
    chainId: 56,
    chainType: 'evm' as const,
    name: 'Test Token',
    address: '0x789',
    symbol: 'TEST',
    desc: 'Test Description',
    // isPremium: false,
    image: 'https://example.com/image.jpg',
  },
  tokenomics: {
    dex: 'uniswap',
    startingMC: 100000,
    endingMC: 1000000,
    fundingTokenAddress: '0xabc',
    fundingTokenDecimals: 18,
    fundingTokenSymbol: 'USDC',
    amountToBuy: '100',
    startingTick: 1000,
    graduationTick: 2000,
    upperMaxTick: 3000,
    graduationLiquidity: 0,
    tickSpacing: 1,
    creatorAllocation: 0,
  },
  links: {
    websiteLink: 'https://example.com',
    telegramLink: 'https://t.me/test',
    launchTweetLink: 'https://twitter.com/example/status/1234567890',
  },
  txHash: '0x456',
  // merkleRoot: '0xadef',
  pool: {
    pool: '0xdef',
    dex: 'pancake',
  },
  aiThesis: {
    name: 'Test Thesis',
    description: 'Strategy description',
    version: '1.0.0',
    strategy: {
      indicatorsEnabled: ['rsi', 'macd', 'movingAverage50'],
      riskLevel: 'MEDIUM',
      enabledFeatures: ['perpDexTrading'],
      maxTradeSizeInPercentageOfBalance: 10,
      maxDailyTrades: 10,
      cooldownAfterLoss: 300000,
      requireConfirmation: false,
      autoStopLoss: true,
      autoTakeProfit: true,
      maxLeverage: 1,
      tokens: {
        whitelistedSymbols: ['ETHUSDT'],
        whitelistCriteria:
          'Only trade Ethereum spot or perp pairs with sufficient liquidity (>10k 24h volume) and volatility under 15%.',
        leverageOverride: {
          ETHUSDT: 1,
        },
      },
      prompt: {
        goals:
          'Deploy a conservative AI trader that focuses on Ethereum opportunities with disciplined risk management and 24/7 availability.',
        tradingStrategy:
          'Analyze technical indicators (RSI, MACD, moving averages), market sentiment, and volume trends to issue BUY, SELL, or HOLD recommendations with reasoning.',
        riskStrategy:
          'Continuously assess volatility, liquidity, and broader market trends to rate risk as LOW, MEDIUM, or HIGH and adjust exposure accordingly while respecting stop-loss and take-profit automation.',
        positionSizingStrategy:
          'Size positions based on account balance, volatility, and AI confidence—never exceed 10% of balance per trade and enforce cooldowns after losses.',
      },
    },
  },
};

describe('Create Token Controller', () => {
  let mockUser: IUserModel;
  let mockOtherUsers: IUserModel[];

  beforeEach(async () => {
    // Create a mock user before each test
    mockUser = await Users.create({
      userName: 'testuser',
      walletAddress: '0x123',
      twitterId: '123456',
      twitterScreenName: 'testuser',
      twitterVerified: false,
      twitterFollowers: 100,
      totalTweets: 50,
      twitterAccountAgeInDay: '365',
      referralCode: 'TEST123',
      referralCount: 0,
      karma: 0,
      finalScore: 0,
      twitterProfileImageUrl: 'https://example.com/profile.jpg',
      isBot: true,
    });

    // Create additional mock users
    mockOtherUsers = await Promise.all([
      Users.create({
        userName: 'otheruser1',
        walletAddress: '0x456',
        twitterId: '789012',
        twitterScreenName: 'otheruser1',
        twitterVerified: false,
        twitterFollowers: 50,
        totalTweets: 25,
        twitterAccountAgeInDay: '180',
        referralCode: 'TEST456',
        referralCount: 0,
        karma: 0,
        finalScore: 0,
        twitterProfileImageUrl: 'https://example.com/profile2.jpg',
        isBot: true,
      }),
      Users.create({
        userName: 'otheruser2',
        walletAddress: '0x789',
        twitterId: '345678',
        twitterScreenName: 'otheruser2',
        twitterVerified: false,
        twitterFollowers: 75,
        totalTweets: 30,
        twitterAccountAgeInDay: '270',
        referralCode: 'TEST789',
        referralCount: 0,
        karma: 0,
        finalScore: 0,
        twitterProfileImageUrl: 'https://example.com/profile3.jpg',
        isBot: true,
      }),
    ]);
  });

  afterEach(async () => {
    // Clean up after each test
    await Users.deleteMany({});
    await Tokens.deleteMany({});
  });

  it('should create a new token with valid data and send messages from multiple users', async () => {
    // Mock responses
    (getPoolDetailsFromCreateTx as jest.Mock).mockResolvedValue({
      pool: '0xdef',
      dex: 'pancake',
      token: '0x789',
    });

    const result = await createToken(mockTokenData, mockUser);

    // Verify token was created
    const createdToken = await Tokens.findOne({ 'basicDetails.address': '0x789' });
    expect(createdToken).toBeTruthy();
    expect(createdToken?.basicDetails).toEqual(
      expect.objectContaining({
        chainId: 56,
        chainType: 'evm',
        name: 'Test Token',
        symbol: 'TEST',
        desc: 'Test Description',
        image: 'https://example.com/image.jpg',
      })
    );

    // Verify response
    expect(result).toMatchObject({
      tokenAddress: '0x789',
      imgUrl: 'https://example.com/image.jpg',
      chainId: 56,
      message: 'Token created successfully',
    });
  });

  it('should throw BadRequestError if token address already exists', async () => {
    // Create existing token
    mockTokenData.walletAddress = mockUser.walletAddress;
    await Tokens.create(mockTokenData);

    (getPoolDetailsFromCreateTx as jest.Mock).mockResolvedValue({
      pool: '0xdef',
      dex: 'pancake',
      token: '0x789',
    });

    await expect(createToken(mockTokenData, mockUser)).rejects.toThrow(BadRequestError);
  });

  it('should throw BadRequestError if content is not safe', async () => {
    await expect(createToken(mockTokenData, mockUser)).rejects.toThrow(BadRequestError);
  });

  it('should throw BadRequestError if required fields are missing', async () => {
    const mockTokenDataWithoutTxHash = { ...mockTokenData, txHash: undefined };

    await expect(
      createToken(mockTokenDataWithoutTxHash as unknown as ICreateToken, mockUser)
    ).rejects.toThrow(BadRequestError);
  });
});
