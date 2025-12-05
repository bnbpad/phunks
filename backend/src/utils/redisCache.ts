import { createClient, RedisClientType } from 'redis';
import nconf from '../config/nconf';
import { get24HoursAgoTimestamp } from './time';

export interface CachedTrade {
  id: string;
  tokenId: string;
  tokenName: string;
  tokenImage: string;
  tokenSymbol: string;
  type: string;
  sender: string;
  txSender: string;
  recipient: string;
  timestamp: string;
  amount0: string;
  amount1: string;
  priceUSD: number;
  basePrice: number;
  from: string;
  to: string;
}

export interface CachedPoolTrade {
  amount0: string;
  amount1: string;
  timestamp: string;
}

class RedisTradeCache {
  private client: RedisClientType;

  constructor() {
    this.client = createClient({
      url: nconf.get('REDIS_URL') || 'redis://localhost:6379',
      socket: { reconnectStrategy: retries => Math.min(retries * 50, 500) },
    });

    this.client.on('error', err => console.error('Redis Client Error:', err));
    this.client.on('connect', () => console.log('Redis Client Connected'));
    this.client.on('disconnect', () => console.log('Redis Client Disconnected'));
  }

  async connect(): Promise<void> {
    if (!this.client.isOpen) {
      await this.client.connect();
    }
  }

  private getTradeCacheKey(chainId: string, tokenAddress?: string): string {
    return `recentNtrade:${chainId}:${tokenAddress || 'all'}`;
  }

  private getTimestampKey(chainId: string, tokenAddress?: string): string {
    return `recentNtrade:timestamp:${chainId}:${tokenAddress || 'all'}`;
  }

  async getCachedTrades(chainId: string, tokenAddress?: string): Promise<CachedTrade[] | null> {
    await this.connect();
    const key = this.getTradeCacheKey(chainId, tokenAddress);
    try {
      const data = await this.client.get(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error(`[RedisCache] Error getting cached trades:`, error);
      return null;
    }
  }

  async setCachedTrades(
    chainId: string,
    tokenAddress: string | undefined,
    trades: CachedTrade[]
  ): Promise<void> {
    await this.connect();
    const key = this.getTradeCacheKey(chainId, tokenAddress);
    const timestampKey = this.getTimestampKey(chainId, tokenAddress);

    try {
      await this.client.set(key, JSON.stringify(trades));
      if (trades.length > 0) {
        await this.client.set(timestampKey, trades[0].timestamp);
      }
    } catch (error) {
      console.error(`Error setting cached trades:`, error);
    }
  }

  async getLastCachedTimestamp(chainId: string, tokenAddress?: string): Promise<string | null> {
    await this.connect();
    const timestampKey = this.getTimestampKey(chainId, tokenAddress);
    try {
      const timestamp = await this.client.get(timestampKey);
      return timestamp;
    } catch (error) {
      console.error(`Error getting cached timestamp:`, error);
      return null;
    }
  }

  async cleanupOldTrades(chainId: string, tokenAddress?: string): Promise<void> {
    await this.connect();
    const key = this.getTradeCacheKey(chainId, tokenAddress);
    const data = await this.client.get(key);

    if (data) {
      const trades: CachedTrade[] = JSON.parse(data);
      const twentyFourHoursAgo = get24HoursAgoTimestamp();
      const recentTrades = trades.filter(trade => parseInt(trade.timestamp) > twentyFourHoursAgo);

      if (recentTrades.length !== trades.length) {
        await this.client.set(key, JSON.stringify(recentTrades));
        console.log(`Cleaned up ${trades.length - recentTrades.length} old trades from cache`);
      }
    }
  }

  private getPoolTradesCacheKey(chainId: string, tokenAddress: string): string {
    return `poolTrades:${chainId}:${tokenAddress}`;
  }

  private getPoolTradesTimestampKey(chainId: string, tokenAddress: string): string {
    return `poolTrades:timestamp:${chainId}:${tokenAddress}`;
  }

  async getCachedPoolTrades(
    chainId: string,
    tokenAddress: string
  ): Promise<CachedPoolTrade[] | null> {
    await this.connect();
    const key = this.getPoolTradesCacheKey(chainId, tokenAddress);
    try {
      const data = await this.client.get(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error(`[RedisCache] Error getting cached pool trades:`, error);
      return null;
    }
  }

  async setCachedPoolTrades(
    chainId: string,
    tokenAddress: string,
    trades: CachedPoolTrade[]
  ): Promise<void> {
    await this.connect();
    const key = this.getPoolTradesCacheKey(chainId, tokenAddress);
    const timestampKey = this.getPoolTradesTimestampKey(chainId, tokenAddress);

    try {
      await this.client.set(key, JSON.stringify(trades));
      if (trades.length > 0) {
        await this.client.set(timestampKey, trades[0].timestamp);
      }
    } catch (error) {
      console.error(`Error setting cached pool trades:`, error);
    }
  }

  async getLastCachedPoolTradesTimestamp(
    chainId: string,
    tokenAddress: string
  ): Promise<string | null> {
    await this.connect();
    const timestampKey = this.getPoolTradesTimestampKey(chainId, tokenAddress);
    try {
      const timestamp = await this.client.get(timestampKey);
      return timestamp;
    } catch (error) {
      console.error(`Error getting cached pool trades timestamp:`, error);
      return null;
    }
  }

  async cleanupOldPoolTrades(chainId: string, tokenAddress: string): Promise<void> {
    await this.connect();
    const key = this.getPoolTradesCacheKey(chainId, tokenAddress);
    const data = await this.client.get(key);

    if (data) {
      const trades: CachedPoolTrade[] = JSON.parse(data);
      const twentyFourHoursAgo = get24HoursAgoTimestamp();
      const recentTrades = trades.filter(trade => parseInt(trade.timestamp) > twentyFourHoursAgo);

      if (recentTrades.length !== trades.length) {
        await this.client.set(key, JSON.stringify(recentTrades));
        console.log(`Cleaned up ${trades.length - recentTrades.length} old pool trades from cache`);
      }
    }
  }
}

export const redisTradeCache = new RedisTradeCache();
export default redisTradeCache;
