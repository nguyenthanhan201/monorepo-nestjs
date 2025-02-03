import { BadRequestError } from "@app/shared/core/error.response";
import { SuccessResponse } from "@app/shared/core/success.response";
import { GenericFilter } from "@app/shared/services/page.service";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Inject, Injectable, NestMiddleware } from "@nestjs/common";
import { Cache } from "cache-manager";
import { NextFunction, Request, Response } from "express";
import { getCacheKeyFromPath } from "../utils/redis";

@Injectable()
export class RedisMiddleware implements NestMiddleware {
  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}

  async use(
    req: Request<any, any, any, GenericFilter>,
    res: Response,
    next: NextFunction
  ) {
    const key = getCacheKeyFromPath(req.path);
    const { page, pageSize } = req.query;

    if (!key) return next();

    const message = `List ${key} from cache redis OK`;

    try {
      const cacheRedis: Array<any> = await this.cacheManager.get(key);

      if (cacheRedis) {
        // const pageCache = paginate({
        //   page,
        //   pageSize,
        //   data: cacheRedis,
        // });

        // const result = {
        //   data: cacheRedis,
        //   total: cacheRedis.length,
        //   page,
        //   pageSize,
        //   totalPages: Math.ceil(cacheRedis.length / pageSize),
        // };

        return new SuccessResponse({
          message,
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
