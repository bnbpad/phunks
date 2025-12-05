import { TokenLikes } from '../../database/tokenLikes';
import { BadRequestError, NotFoundError } from '../../errors';

/**
 * Like or dislike a token
 * @param tokenAddress - The token ID
 * @param userAddress - The user's wallet address
 */
export const toggleTokenLike = async (tokenAddress: string, userAddress: string) => {
  if (!tokenAddress || !userAddress) {
    throw new BadRequestError('Token ID and user address are required');
  }

  const tokenLike = await TokenLikes.findOne({ tokenAddress });

  if (!tokenLike) {
    // Create new document if it doesn't exist
    await TokenLikes.create({
      tokenAddress,
      likes: [userAddress],
    });
    return;
  }

  // Check if user already liked
  const hasLiked = tokenLike.likes.includes(userAddress);

  if (hasLiked) {
    // Remove like if already liked
    tokenLike.likes = tokenLike.likes.filter(addr => addr !== userAddress);
  } else {
    // Add like
    tokenLike.likes.push(userAddress);
  }

  await tokenLike.save();
};

/**
 * Get users that liked a token
 * @param tokenAddress - The token ID
 */
export const getTokenLike = async (tokenAddress: string) => {
  if (!tokenAddress) {
    throw new NotFoundError('Token not found');
  }
  const token = await TokenLikes.findOne({ tokenAddress });
  return token?.likes || [];
};

/**
 * Get all tokens liked by a user
 * @param userAddress - The user's wallet address
 */
export const getUserLikedTokens = async (userAddress: string) => {
  const likedTokens = await TokenLikes.find({
    likes: userAddress,
  }).select('tokenAddress');

  return likedTokens.map(token => token.tokenAddress);
};
