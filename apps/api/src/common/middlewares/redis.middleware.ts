import { BadRequestError } from "@app/shared/core/error.response";
import { SuccessResponse } from "@app/shared/core/success.response";
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
        new SuccessResponse({
          message: `List ${key} from cache redis OK`,
          metadata: cacheRedis,
        }).send(res);
      } else {
        next();
      }
    } catch (err) {
      return new BadRequestError(err.message).send(res);
    }
  }
}
