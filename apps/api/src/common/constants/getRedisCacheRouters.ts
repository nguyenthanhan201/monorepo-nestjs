import { RequestMethod } from '@nestjs/common';
import { RouteInfo } from '@nestjs/common/interfaces';

export const routesWithRedisMiddleware: RouteInfo[] = [
  { path: 'product/getAllProducts/:key', method: RequestMethod.GET },
];
