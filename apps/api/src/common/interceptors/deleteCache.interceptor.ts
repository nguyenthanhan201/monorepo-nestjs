import { CACHE_MANAGER } from "@nestjs/cache-manager";
import {
  CallHandler,
  ExecutionContext,
  HttpStatus,
  Inject,
  Injectable,
  NestInterceptor,
  Optional,
} from "@nestjs/common";
import { Cache } from "cache-manager";
import { Observable } from "rxjs";
import { routesWithRedisMiddleware } from "../constants/getRedisCacheRouters";
import { getCacheKeyFromPath } from "../utils/redis";

@Injectable()
export class DeleteCacheInterceptor implements NestInterceptor {
  @Optional()
  @Inject()
  protected allowedMethods = ["PUT", "DELETE", "POST"];
  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler
  ): Promise<Observable<any>> {
    if (!this.isRequestDeleteCacheable(context)) {
      return next.handle();
    }

    console.log("running cache interceptor");

    const httpContext = context.switchToHttp();
    const response = httpContext.getResponse();
    // console.log("👌  response:", response);
    const request = httpContext.getRequest();
    const statusCode = response.statusCode;
    const path = request.url;

    const cacheKey = getCacheKeyFromPath(path);

    if (
      statusCode === HttpStatus.CREATED ||
      statusCode === HttpStatus.NO_CONTENT
    ) {
      console.log("delete cache");
      await this.cacheManager.del(cacheKey);
    }

    return next.handle();
  }

  protected isRequestDeleteCacheable(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const path = request.url;

    const cacheKey = getCacheKeyFromPath(path);
    console.log("👌  cacheKey:", cacheKey);
    const redisCacheRouters = routesWithRedisMiddleware.map(
      (router) => router.path
    );

    return (
      this.allowedMethods.includes(request.method) &&
      redisCacheRouters.includes(cacheKey)
    );
  }
}
