import { NextFunction, Request, Response } from 'express';
import cache from '../utils/cache';

export interface IResponseCached extends Response {
  jsonCached: (body: any) => void;
}

const locks = new Map<string, Promise<void>>();

/**
 * @description Cache the response for the given duration and only cache GET requests
 * @param duration - The duration to cache the response
 * @returns The middleware function
 */
export const cacheJsonMiddleware =
  (duration: number) => async (req: Request, res: IResponseCached, next: NextFunction) => {
    if (req.method !== 'GET') {
      next();
      return;
    }

    const key = req.originalUrl;

    const lock = locks.get(key);
    if (lock) await lock;

    const cachedData = cache.get<string>(key);
    if (cachedData) {
      res.json(JSON.parse(cachedData));
      return;
    }

    const newLock = new Promise<void>(resolve => {
      const timeoutId = setTimeout(resolve, 3000);

      res.jsonCached = (body: any) => {
        const stringifiedBody = JSON.stringify(body);
        cache.set(key, stringifiedBody, duration);
        res.json(body);

        resolve();
        locks.delete(key);

        clearTimeout(timeoutId);
      };
    });

    locks.set(key, newLock);

    next();
  };
