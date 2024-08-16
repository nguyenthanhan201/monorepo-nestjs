import { RequestMethod } from "@nestjs/common";
import { RouteInfo } from "@nestjs/common/interfaces";

export const routesWithRedisMiddleware: RouteInfo[] = [
  { path: "product", method: RequestMethod.GET },
  { path: "brand", method: RequestMethod.GET },
];
