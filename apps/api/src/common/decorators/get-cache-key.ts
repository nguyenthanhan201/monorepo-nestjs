import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { getCacheKeyFromPath } from "../utils/redis";

export const GetCacheKey = createParamDecorator(
  (_data: never, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    return getCacheKeyFromPath(req.path);
  }
);
