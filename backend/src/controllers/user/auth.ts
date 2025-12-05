import { verifyChainSignature } from '../../utils/verifySign';
import { IUserModel, Users } from '../../database/user';
import { BadRequestError } from '../../errors';
import { generateJWT } from '../../utils/jwt';
import nconf from 'nconf';
// import { updateUserKarma } from '../../utils/karma';

/**
 * Login a user
 * @param message - The message to sign
 * @param signature - The signature of the message
 * @param chainType - The chain type
 * @param walletAddress - The wallet address
 * @param referrerCode - The referrer code
 * @returns The user id, user name, and jwt token
 */
export const login = async (
  message: string,
  signature: string,
  chainType: string,
  walletAddress: string,
  referrerCode?: string
) => {
  if (!message || !signature || !chainType || !walletAddress)
    throw new BadRequestError('Missing required fields');

  let user = await Users.findOne({ walletAddress: walletAddress.toLowerCase() });

  const { verified } = await verifyChainSignature(
    chainType || 'evm',
    walletAddress,
    message,
    signature
  );

  if (!verified) throw new BadRequestError('Signature verification failed');

  if (!user) {
    if (referrerCode) {
      const referrer = await Users.findOne({ referralCode: referrerCode }).select(
        'walletAddress referralCount'
      );
      if (!referrer) throw new BadRequestError('invalid referrer code');
      user = await Users.create({
        userName: walletAddress.toLowerCase(),
        walletAddress: walletAddress.toLowerCase(),
        referrerCode,
        referredBy: referrer.walletAddress,
        referredAt: referrerCode ? Date.now() : 0,
        twitterProfileImageUrl: `${nconf.get('AWS_CDN')}icons/icon${Math.floor(Math.random() * 12) + 1}.png`,
      });

      referrer.referralCount = referrer.referralCount + 1;
      await referrer.save();

      // Update karma of referrer
      // await updateUserKarma(referrer.id);
    } else {
      user = await Users.create({
        userName: walletAddress.toLowerCase(),
        walletAddress: walletAddress.toLowerCase(),
        twitterProfileImageUrl: `${nconf.get('AWS_CDN')}icons/icon${Math.floor(Math.random() * 12) + 1}.png`,
      });
    }

    const token = generateJWT(user);
    return {
      userId: user._id,
      walletAddress: user.walletAddress,
      userName: user.userName,
      jwt: token,
    };
  }

  const token = generateJWT(user);
  return {
    userId: user._id,
    walletAddress: user.walletAddress,
    userName: user.userName,
    jwt: token,
  };
};

/**
 * Update the user name of the logged in user. Checks if the user name already exists.
 * @param loggedInUser - The logged in user
 * @param userName - The user name
 * @returns The user
 */
export const updateUserName = async (loggedInUser: IUserModel, userName: string) => {
  const userNameExists = await Users.findOne({ userName: userName });
  if (userNameExists) throw new BadRequestError('Username already exists');
  loggedInUser.userName = userName;
  await loggedInUser.save();
  return loggedInUser;
};
