import { validateTokenCreation } from '../create';
import { ICreateToken } from '../types';
import { Tokens } from '../../../database/token';
import { BadRequestError } from '../../../errors';
import { CHAIN_CONFIG } from '../../../utils/constant';
import { IUserModel } from '../../../database/user';

// Mock dependencies
jest.mock('../../../database/token');
jest.mock('../../ai-models/contentModetration');
jest.mock('../../../utils/constant');

const mockTokenData: ICreateToken = {
  basicDetails: {
    name: 'Test Token',
    symbol: 'TT',
    desc: 'A test token',
    image: 'https://example.com/image.png',
    address: '0x123',
    chainId: 1,
    chainType: 'evm',
    // isPremium: false,
  },
  tokenomics: {
    dex: 'uniswap',
    startingMC: 1000,
    endingMC: 2000,
    fundingTokenSymbol: 'ETH',
    fundingTokenAddress: '0x456',
    fundingTokenDecimals: 18,
    amountToBuy: '100',
    startingTick: 1000,
    graduationTick: 2000,
    upperMaxTick: 3000,
    graduationLiquidity: 0,
    tickSpacing: 1,
    creatorAllocation: 0,
  },
  links: {
    discordLink: 'https://discord.gg/test',
    twitterLink: 'https://twitter.com/test',
    telegramLink: 'https://t.me/test',
    websiteLink: 'https://example.com',
    twitchLink: 'https://twitch.tv/test',
    launchTweetLink: 'https://twitter.com/test/status/123',
  },
  txHash: '0xdef',
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

const mockLoggedInUser = {
  walletAddress: '0xabc',
} as IUserModel;

describe('validateTokenCreation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (Tokens.exists as jest.Mock).mockResolvedValue(false);
    (CHAIN_CONFIG as any) = { 1: {} };
  });

  it('should throw BadRequestError if token address already exists', async () => {
    (Tokens.exists as jest.Mock).mockResolvedValue(true);

    await expect(validateTokenCreation(mockTokenData, false, mockLoggedInUser)).rejects.toThrow(
      new BadRequestError('Token address already exists')
    );
  });

  it('should throw BadRequestError if chain ID is not supported', async () => {
    (CHAIN_CONFIG as any) = {};

    await expect(validateTokenCreation(mockTokenData, false, mockLoggedInUser)).rejects.toThrow(
      new BadRequestError('Unsupported chain ID')
    );
  });

  it('should throw BadRequestError if required fields are missing', async () => {
    const invalidData = { ...mockTokenData };
    invalidData.basicDetails = undefined as any;

    await expect(validateTokenCreation(invalidData, false, mockLoggedInUser)).rejects.toThrow(
      new BadRequestError("Cannot read properties of undefined (reading 'address')")
    );
  });

  it('should throw BadRequestError if token validation fails', async () => {
    const mockError = new Error('Validation failed');
    (Tokens.validate as jest.Mock).mockRejectedValue(mockError);

    await expect(validateTokenCreation(mockTokenData, false, mockLoggedInUser)).rejects.toThrow(
      new BadRequestError('Validation failed')
    );
  });

  it('should not throw any error if all validations pass', async () => {
    (Tokens.validate as jest.Mock).mockResolvedValue(undefined);

    await expect(
      validateTokenCreation(mockTokenData, false, mockLoggedInUser)
    ).resolves.not.toThrow();
  });
});
