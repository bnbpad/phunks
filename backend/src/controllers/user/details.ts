import { Tokens } from '../../database/token';
import { Users } from '../../database/user';
import { BadRequestError, NotFoundError } from '../../errors';
import { getAllTokenHolders } from '../../subgraph';
import { blackListedTokens } from '../../utils/constant';
import { getTokensDetail } from '../token';
import { getUserLikedTokens } from '../token/likes';

export interface GetUserDetailsParams {
  walletAddress: string;
  chainId: string;
}

export const getUserDetails = async ({ walletAddress, chainId }: GetUserDetailsParams) => {
  if (!walletAddress || !chainId)
    throw new BadRequestError('Wallet address and chainId are required');

  const formattedAddress = walletAddress.toLowerCase().trim();
  const result: any = {};

  // get user details
  const user = await Users.findOne({
    walletAddress: formattedAddress,
  }).select('userName walletAddress');

  if (!user) {
    result.userDetails = {};
    result.social = { likedTokens: [''] };
  } else {
    const likedTokens = await getUserLikedTokens(formattedAddress);
    result.userDetails = user.toObject();
    result.social = {
      likedTokens,
    };
  }

  // get tokens created by user
  try {
    const dbTokens = await Tokens.find({
      $and: [{ walletAddress: formattedAddress }, { 'basicDetails.chainId': Number(chainId) }],
    })
      .lean()
      .select('basicDetails createdAt');

    const tokens = await getTokensDetail(chainId, 0, 1, 100, dbTokens);

    result.tokensCreated = tokens;
  } catch (error) {
    result.tokensCreated = {
      error: `Error getting tokens: ${error}`,
    };
  }

  // get Holdings
  if (chainId) {
    try {
      const allDbTokens = await Tokens.find({}).select('basicDetails createdAt');

      // If no tokens in database, return empty array
      if (allDbTokens.length === 0) {
        result.holdings = [];
        return result;
      }

      // TODO: add pagination to handle more than 1000 holders
      const tokens = await getAllTokenHolders(chainId, {
        dbTokens: allDbTokens.map(token => token.basicDetails.address),
        blacklistedTokens: blackListedTokens,
      });

      const tokenAddresses = Array<string>();
      const holdingPercentMap = new Map<
        string,
        { percentageHolding: number; amountHolding: number }
      >();

      tokens.forEach(token => {
        const holderData = token.holders.find(
          (h: any) => h.holder.toLowerCase() === formattedAddress
        );
        if (holderData && parseFloat(holderData.amount) > 0) {
          tokenAddresses.push(token.id);
          const totalSupply = parseFloat(token.totalSupply);
          const amounte18 = parseFloat(holderData.amount);

          const amount = amounte18 / 1e18;
          const percentageHolding = totalSupply > 0 ? (amounte18 / totalSupply) * 100 : 0;
          holdingPercentMap.set(token.id, { percentageHolding, amountHolding: amount });
        }
      });

      const holdings = await getTokensDetail(
        chainId,
        0,
        1,
        100,
        allDbTokens.filter(token => tokenAddresses.includes(token.basicDetails.address))
      );

      result.holdings = holdings.map(holding => ({
        ...holding,
        holdingPercent: holdingPercentMap.get(holding?.basicDetails?.address || '')
          ?.percentageHolding,
        amountHolding: holdingPercentMap.get(holding?.basicDetails?.address || '')?.amountHolding,
      }));
    } catch (error) {
      result.holdings = {
        error: `Error getting token holdings: ${error}`,
      };
    }
  }
  return result;
};
