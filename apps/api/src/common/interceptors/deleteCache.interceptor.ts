import { CACHE_MANAGER } from "@nestjs/cache-manager";
import {
  CallHandler,
  ExecutionContext,
  Inject,
  Injectable,
  NestInterceptor,
  Optional,
} from "@nestjs/common";
import { Cache } from "cache-manager";
import { Observable } from "rxjs";
import { cacheModules } from "../constants/cacheModules";
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
    const request = httpContext.getRequest();
    const statusCode = response.statusCode;
    const path = request.url;

    const cacheKey = getCacheKeyFromPath(path);

    if (statusCode === 200) {
      await this.cacheManager.del(cacheKey);
    }

    return next.handle();
  }

  protected isRequestDeleteCacheable(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const path = request.url;

    const cacheKey = getCacheKeyFromPath(path);

    return (
      this.allowedMethods.includes(request.method) &&
      cacheModules.includes(cacheKey)
    );
  }
}
