import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Inject, Injectable, NestMiddleware } from "@nestjs/common";
import { Cache } from "cache-manager";
import { NextFunction, Request, Response } from "express";

@Injectable()
export class RedisMiddleware implements NestMiddleware {
  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const { key } = req.params;

    try {
      const cacheRedis = await this.cacheManager.get(key);

      if (cacheRedis) {
        res.json({
          fromCache: true,
          data: cacheRedis,
        });
      } else {
        next();
      }
    } catch (err) {
      console.log("err redis middleware", err);
      return res.status(500).json({ error: err.message });
    }
  }
}
