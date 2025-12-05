import { Users } from '../../../database/user';
import { Tokens } from '../../../database/token';
import { BadRequestError, NotFoundError } from '../../../errors';
import { getUserDetails } from '../details';
import { getAllTokenHolders, getTokenHolding, listTokens } from '../../../subgraph';
import { fetchTokenData } from '../../token/details';
import { getPriceCoinGecko } from '../../../utils/getPrice';
import { Types } from 'mongoose';
import { getUserLikedTokens } from '../../token/likes';

// Mock the subgraph and token data fetching
jest.mock('../../../subgraph', () => ({
  getTokenHolding: jest.fn(),
  listTokens: jest.fn(),
  getAllTokenHolders: jest.fn(),
}));

jest.mock('../../token/details', () => ({
  fetchTokenData: jest.fn(),
}));

jest.mock('../../token/likes', () => ({
  getUserLikedTokens: jest.fn(),
}));

// Mock the price fetching and decimals map
jest.mock('../../../utils/getPrice', () => ({
  getPriceCoinGecko: jest.fn(),
  getBNBHistoricalPrice: jest.fn().mockResolvedValue([
    {
      price: '1.0',
      timestamp: Date.now(),
    },
  ]),
  tokenDecimalsNormalisationMap: {
    '0x789': 1e6, // Mock USDC-like token with 6 decimals
  },
}));

describe('User Details Controller', () => {
  beforeEach(async () => {
    jest.clearAllMocks();
  });

  it('should throw BadRequestError if walletAddress or chainId is missing', async () => {
    await expect(getUserDetails({ walletAddress: '', chainId: '1' })).rejects.toThrow(
      BadRequestError
    );
    await expect(getUserDetails({ walletAddress: '0x123', chainId: '' })).rejects.toThrow(
      BadRequestError
    );
  });

  it('should return user details with tokens, holdings and social counts', async () => {
    // Create a user in the database
    const user = await Users.create({
      userName: 'testUser',
      walletAddress: '0x123',
      twitterVerified: true,
      twitchVerified: false,
      twitterId: '123',
      twitterScreenName: 'testUser',
      twitterFollowers: 100,
      twitterAccountAgeInDay: '100',
      totalTweets: 50,
      twitterProfileImageUrl: 'https://example.com/profile.jpg',
      jwt: 'test-jwt',
      referralCode: 'test-ref',
      referrerCode: 'test-ref-code',
      karma: 0,
      finalScore: 0,
    });

    // Create tokens in the database
    const token = await Tokens.create({
      basicDetails: {
        chainId: 1,
        chainType: 'evm',
        address: '0x123',
        name: 'Test Token',
        symbol: 'TEST',
        desc: 'Test Description',
        image: 'https://example.com/image.jpg',
      },
      tokenomics: {},
      taxInfo: {},
      taxDistribution: {},
      fees: {},
      links: {},
      walletAddress: '0x123',
      reviewed: true,
      pool: {},
      marketCap: 1000000,
      launchRightAway: true,
    });

    // Mock token holdings
    const mockTokenHoldings = [
      {
        id: token.basicDetails.address,
        holders: [
          {
            holder: '0x123',
            amount: '1000000000000000000', // 1 token in wei
          },
        ],
        totalSupply: '10000000000000000000', // 10 tokens in wei
        pool: {
          trade: [
            {
              quoteTokenMarketCap: 1000000,
              amount0: '1000000000000000000', // 1 token in wei
              amount1: '1000000', // 1 USDC (6 decimals)
            },
          ],
          token1: '0x789', // Mock USDC-like token
        },
      },
    ];

    // Mock token data
    const mockTokenData = {
      name: 'Test Token',
      symbol: 'TEST',
      decimals: 18,
    };

    const mockTokenList = {
      id: '0x123',
      name: 'Test Token',
      symbol: 'TEST',
      totalSupply: '10000000000000000000',
      transactionHash: '0x123',
      fundingToken: '0x789',
      creator: '0x123',
      graduated: true,
      metadata: '{"name": "Test Token", "symbol": "TEST", "decimals": 18}',
      holderCount: 1,
      pool: '0x00',
    };

    // Mock price data
    const mockPrices = {
      '0x789': 1.0, // USDC price
    };

    // Setup mocks
    (getTokenHolding as jest.Mock).mockResolvedValue(mockTokenHoldings);
    (fetchTokenData as jest.Mock).mockResolvedValue(mockTokenData);
    (getPriceCoinGecko as jest.Mock).mockResolvedValue(mockPrices);
    (listTokens as jest.Mock).mockResolvedValue([mockTokenList]);
    (getAllTokenHolders as jest.Mock).mockResolvedValue([]);
    (getUserLikedTokens as jest.Mock).mockResolvedValue([]);
    const result = await getUserDetails({ walletAddress: '0x123', chainId: '1' });

    // Verify user details
    expect(result.userDetails).toEqual(
      expect.objectContaining({
        userName: 'testUser',
        walletAddress: '0x123',
        twitterVerified: true,
        twitchVerified: false,
        twitterId: '123',
        twitterScreenName: 'testUser',
        twitterFollowers: 100,
        twitterAccountAgeInDay: '100',
        totalTweets: 50,
        twitterProfileImageUrl: 'https://example.com/profile.jpg',
      })
    );

    // Verify social counts
    expect(result.social).toEqual({
      followingCount: 2,
      followersCount: 1,
      messageCount: 2,
      likedTokens: [],
    });

    // Verify holdings
    // todo this neesd to be written up
    // expect(result.holdings).toHaveLength(1);
    // expect(result.holdings[0]).toEqual({
    //   details: mockTokenData,
    //   amount: 1, // 1 token
    //   amountInUsd: 1.0, // 1 token * $1.0 (USDC price)
    //   percentageHolding: 10, // (1/10) * 100
    //   marketCapInUSD: 10000000000000000000,
    //   usdVolume24hr: 0,
    // });
  });

  it('should handle errors gracefully', async () => {
    // Create a user in the database
    const user = await Users.create({
      userName: 'testUser',
      walletAddress: '0x123',
      twitterVerified: true,
      twitchVerified: false,
      twitterId: '123',
      twitterScreenName: 'testUser',
      twitterFollowers: 100,
      twitterAccountAgeInDay: '100',
      totalTweets: 50,
      twitterProfileImageUrl: 'https://example.com/profile.jpg',
      jwt: 'test-jwt',
      referralCode: 'test-ref',
      referrerCode: 'test-ref-code',
      karma: 0,
      finalScore: 0,
    });

    await Tokens.create({
      basicDetails: {
        chainId: 1,
        chainType: 'evm',
        address: '0xabc',
        name: 'Error Token',
        symbol: 'ERR',
        desc: 'Error Description',
        image: 'https://example.com/error.jpg',
      },
      tokenomics: {},
      taxInfo: {},
      taxDistribution: {},
      fees: {},
      links: {},
      walletAddress: '0x123',
      reviewed: true,
      pool: {},
      marketCap: 1000000,
      launchRightAway: true,
    });

    // Setup mocks with errors
    (getAllTokenHolders as jest.Mock).mockRejectedValue(new Error('Holdings fetch error'));

    const result = await getUserDetails({ walletAddress: '0x123', chainId: '1' });

    // Verify user details are still present
    expect(result.userDetails).toEqual(
      expect.objectContaining({
        userName: 'testUser',
        walletAddress: '0x123',
      })
    );

    // Verify social counts are present even when there's an error
    expect(result.social).toEqual({
      followingCount: 0,
      followersCount: 0,
      messageCount: 0,
      likedTokens: [],
    });

    // Verify error messages in holdings
    expect(result.holdings.error).toBeDefined();
  });

  it('should handle empty token holdings', async () => {
    // Create a user in the database
    const user = await Users.create({
      userName: 'testUser',
      walletAddress: '0x123',
      twitterVerified: true,
      twitchVerified: false,
      twitterId: '123',
      twitterScreenName: 'testUser',
      twitterFollowers: 100,
      twitterAccountAgeInDay: '100',
      totalTweets: 50,
      twitterProfileImageUrl: 'https://example.com/profile.jpg',
      jwt: 'test-jwt',
      referralCode: 'test-ref',
      referrerCode: 'test-ref-code',
      karma: 0,
      finalScore: 0,
    });

    // Create no social connections
    // This will test that the counts are 0 when there are no connections

    // Setup mocks with empty holdings
    (getAllTokenHolders as jest.Mock).mockResolvedValue([]);
    (listTokens as jest.Mock).mockResolvedValue([]);

    const result = await getUserDetails({ walletAddress: '0x123', chainId: '1' });

    // Verify user details are present
    expect(result.userDetails).toEqual(
      expect.objectContaining({
        userName: 'testUser',
        walletAddress: '0x123',
      })
    );

    // Verify social counts for user with no connections
    expect(result.social).toEqual({
      followingCount: 0,
      followersCount: 0,
      messageCount: 0,
      likedTokens: [],
    });

    // Verify empty arrays for holdings
    expect(result.holdings).toEqual([]);
  });
});
