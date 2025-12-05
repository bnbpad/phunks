import { verifyChainSignature } from '../../../utils/verifySign';
import { Users, IUserModel } from '../../../database/user';
import { BadRequestError } from '../../../errors';
import { login, updateUserName } from '../auth';
// import { updateUserKarma } from '../../../utils/karma';

// Mock the Users model
jest.mock('../../../database/user', () => ({
  Users: {
    findOne: jest.fn(),
    create: jest.fn(),
  },
}));

// Mock the JWT generation
jest.mock('../../../utils/jwt', () => ({
  generateJWT: jest.fn().mockReturnValue('mock-jwt-token'),
}));

// Mock the verifyChainSignature function
jest.mock('../../../utils/verifySign', () => ({
  verifyChainSignature: jest.fn(),
}));

jest.mock('../../../utils/karma', () => ({
  updateUserKarma: jest.fn().mockResolvedValue(undefined),
}));

describe('Auth Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('should throw BadRequestError if required fields are missing', async () => {
      await expect(login('', '', '', '')).rejects.toThrow(BadRequestError);
      await expect(login('message', '', '', '')).rejects.toThrow(BadRequestError);
      await expect(login('message', 'signature', '', '')).rejects.toThrow(BadRequestError);
      await expect(login('message', 'signature', 'chainType', '')).rejects.toThrow(BadRequestError);
    });

    it('should create a new user if user does not exist', async () => {
      const mockUser = {
        _id: '123',
        userName: 'user123',
        walletAddress: '0x123',
        chainType: 'chainType',
        referralCode: 'referral123',
        referrerCode: 'referrer123',
        jwt: 'mock-jwt-token',
        createdAt: new Date(),
        updatedAt: new Date(),
        twitterId: '',
        twitterScreenName: '',
        twitterVerified: false,
        twitchId: '',
        twitchUsername: '',
        twitchVerified: false,
        totalTweets: 0,
        twitterFollowers: 0,
        twitterAccountAgeInDay: '0',
        referralCount: 0,
        referredBy: '',
        karma: 0,
        lastKarmaUpdate: new Date(),
        finalScore: 0,
        twitterProfileImageUrl: '',
        save: jest.fn(),
      } as unknown as IUserModel;

      (Users.findOne as jest.Mock).mockImplementation(query => {
        if (query.walletAddress === '0x123') {
          return null;
        }
        return {
          select: jest.fn().mockResolvedValue({
            walletAddress: '0xabc',
            referralCount: 0,
            id: '456',
            save: jest.fn(),
          }),
        };
      });

      (Users.create as jest.Mock).mockResolvedValue(mockUser);

      // Mock the signature verification
      (verifyChainSignature as jest.Mock).mockResolvedValueOnce({
        verified: true,
        address: '0x123',
      });

      const result = await login('message', 'signature', 'chainType', '0x123', 'referral123');

      expect(Users.findOne).toHaveBeenCalledWith({ walletAddress: '0x123' });
      expect(Users.findOne).toHaveBeenCalledWith({ referralCode: 'referral123' });
      // expect(updateUserKarma).toHaveBeenCalledWith('456');
      expect(result).toEqual({
        userId: mockUser._id,
        walletAddress: mockUser.walletAddress,
        userName: mockUser.userName,
        jwt: 'mock-jwt-token',
      });
    });

    it('should return existing user if user exists', async () => {
      const mockUser = {
        _id: '123',
        userName: 'existingUser',
        walletAddress: '0x123',
        chainType: 'chainType',
        referralCode: 'referral123',
        referrerCode: 'referrer123',
        jwt: 'mock-jwt-token',
        createdAt: new Date(),
        updatedAt: new Date(),
        twitterId: '',
        twitterScreenName: '',
        twitterVerified: false,
        twitchId: '',
        twitchUsername: '',
        twitchVerified: false,
        totalTweets: 0,
        twitterFollowers: 0,
        twitterAccountAgeInDay: '0',
        referralCount: 0,
        referredBy: '',
        karma: 0,
        lastKarmaUpdate: new Date(),
        finalScore: 0,
        twitterProfileImageUrl: '',
      } as unknown as IUserModel;

      (Users.findOne as jest.Mock).mockResolvedValue(mockUser);

      // Mock the signature verification
      (verifyChainSignature as jest.Mock).mockResolvedValueOnce({
        verified: true,
        address: '0x123',
      });

      const result = await login('message', 'signature', 'chainType', '0x123');

      expect(Users.findOne).toHaveBeenCalledWith({ walletAddress: '0x123' });
      expect(Users.create).not.toHaveBeenCalled();
      expect(result).toEqual({
        userId: mockUser._id,
        walletAddress: mockUser.walletAddress,
        userName: mockUser.userName,
        jwt: 'mock-jwt-token',
      });
    });
  });

  describe('updateUserName', () => {
    it('should throw BadRequestError if username already exists', async () => {
      const mockLoggedInUser = {
        _id: '123',
        userName: 'oldName',
        walletAddress: '0x123',
        chainType: 'chainType',
        referralCode: 'referral123',
        referrerCode: 'referrer123',
        jwt: 'mock-jwt-token',
        createdAt: new Date(),
        updatedAt: new Date(),
        twitterId: '',
        twitterScreenName: '',
        twitterVerified: false,
        twitchId: '',
        twitchUsername: '',
        twitchVerified: false,
        totalTweets: 0,
        twitterFollowers: 0,
        twitterAccountAgeInDay: '0',
        referralCount: 0,
        referredBy: '',
        karma: 0,
        lastKarmaUpdate: new Date(),
        finalScore: 0,
        twitterProfileImageUrl: '',
        save: jest.fn(),
      } as unknown as IUserModel;

      (Users.findOne as jest.Mock).mockResolvedValue({ _id: '456' }); // Existing user with same username

      await expect(updateUserName(mockLoggedInUser, 'existingName')).rejects.toThrow(
        BadRequestError
      );
      expect(mockLoggedInUser.save).not.toHaveBeenCalled();
    });

    it('should update username if username is available', async () => {
      const mockLoggedInUser = {
        _id: '123',
        userName: 'oldName',
        walletAddress: '0x123',
        chainType: 'chainType',
        referralCode: 'referral123',
        referrerCode: 'referrer123',
        jwt: 'mock-jwt-token',
        createdAt: new Date(),
        updatedAt: new Date(),
        twitterId: '',
        twitterScreenName: '',
        twitterVerified: false,
        twitchId: '',
        twitchUsername: '',
        twitchVerified: false,
        totalTweets: 0,
        twitterFollowers: 0,
        twitterAccountAgeInDay: '0',
        referralCount: 0,
        referredBy: '',
        karma: 0,
        lastKarmaUpdate: new Date(),
        finalScore: 0,
        twitterProfileImageUrl: '',
        save: jest.fn(),
      } as unknown as IUserModel;

      (Users.findOne as jest.Mock).mockResolvedValue(null); // No user with same username

      const result = await updateUserName(mockLoggedInUser, 'newName');

      expect(mockLoggedInUser.userName).toBe('newName');
      expect(mockLoggedInUser.save).toHaveBeenCalled();
      expect(result).toEqual(mockLoggedInUser);
    });
  });
});
