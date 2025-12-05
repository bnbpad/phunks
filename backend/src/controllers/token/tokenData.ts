import { Tokens } from '../../database/token';

export const getTokenDetails = async (chainId: string, symbol: string) => {
  const data = await Tokens.findOne({
    'basicDetails.symbol': symbol,
    'basicDetails.chainId': chainId,
  });
  if (!data) return null;

  return data;
};
