import { Tokens } from '../../database/token';
import { Users } from '../../database/user';
import { blackListedTokens } from '../../utils/constant';
import { BadRequestError, NotFoundError } from '../../errors';
import { getTokenHolders } from '../../subgraph';
import { Holder, TokenHolders, TokenHoldersParams } from '../../subgraph/types';
import { formatEther } from 'ethers';

export const getTokenHoldersController = async (
  count: number,
  chainId: string,
  tokenAddress: string
) => {
  if (!tokenAddress || !chainId) {
    throw new BadRequestError('Invalid or unsupported chainId / graph');
  }
  if (blackListedTokens.includes(tokenAddress.toLowerCase()))
    throw new BadRequestError('Token is blacklisted');

  const token = await Tokens.findOne({
    'basicDetails.address': tokenAddress.toLowerCase(),
    'basicDetails.chainId': Number(chainId),
  });

  if (!token) {
    throw new NotFoundError('Token not found');
  }

  const params: TokenHoldersParams = {
    tokenAddress,
    skip: 0,
  };
  const holders: Holder[] = [];

  let hasMore = true;
  while (hasMore) {
    const holdersData = await getTokenHolders(chainId, params);
    holders.push(...holdersData[0]?.holders);
    if (holdersData[0]?.holders.length < 1000) hasMore = false;
    params.skip += 1000;
  }
  console.log(holders.length);
  const totalSupply = (1e9).toFixed(0);

  // get twitter screen name and followers count from holders
  const holderAddresses = holders.map(holder => holder.address);
  const holdersWithTwitter = await Users.find({
    walletAddress: { $in: holderAddresses },
  }).select('twitterScreenName twitterFollowers walletAddress twitterProfileImageUrl');

  const holdersWithTwitterMap = new Map(
    holdersWithTwitter.map(holder => [holder.walletAddress, holder])
  );

  return holders
    .map(holder => {
      const amount = formatEther(holder.amount);
      const percent = (Number(amount) / Number(totalSupply)) * 100;
      return {
        ...holder,
        percent,
        twitterScreenName: holdersWithTwitterMap.get(holder.address)?.twitterScreenName ?? '',
        followersCount: holdersWithTwitterMap.get(holder.address)?.twitterFollowers ?? 0,
        twitterProfileImageUrl:
          holdersWithTwitterMap.get(holder.address)?.twitterProfileImageUrl ?? '',
      };
    })
    .filter(holder => holder.percent > 0);
};
