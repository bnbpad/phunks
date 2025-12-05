import CoinGecko from 'coingecko-api';
import cache from './cache';
const CoinGeckoClient = new CoinGecko();

const tokenAddressMap = {
  weth: '0xe5d7c2a44ffddf6b295a15c148167daaaf5cf34f',
  wbnb: '0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c',
};

export const tokenDecimalsNormalisationMap: Record<string, number> = {
  [tokenAddressMap.weth]: 1e18,
  [tokenAddressMap.wbnb]: 1e18,
};

const CACHE_KEY = 'tokenPrices';

export interface TokenPrices {
  [address: string]: number;
}

export interface SymbolPrice {
  price: number;
  lastUpdatedAt?: number;
}

export type AsterDexTokenPrices = Record<string, SymbolPrice>;

export const getPriceCoinGecko = async (): Promise<TokenPrices> => {
  const cachedPrices = await cache.get(CACHE_KEY);
  if (cachedPrices) {
    return cachedPrices as TokenPrices;
  }

  try {
    const data = await CoinGeckoClient.simple.price({
      ids: ['weth', 'wbnb'],
      vs_currencies: ['usd'],
    });

    const prices: TokenPrices = {
      [tokenAddressMap.weth.toLowerCase()]: data.data.weth?.usd ?? 0,
      [tokenAddressMap.wbnb.toLowerCase()]: data.data.wbnb?.usd ?? 0,
    };

    cache.set(CACHE_KEY, prices, 6000);

    return prices;
  } catch (err) {
    console.error('Failed to fetch prices', err);
    return {
      [tokenAddressMap.weth.toLowerCase()]: 0,
    };
  }
};
