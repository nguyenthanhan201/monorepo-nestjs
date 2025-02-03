import { routesWithRedisMiddleware } from "../constants/getRedisCacheRouters";

export const getCacheKey = (path: string) => {
  return path.split("/").pop();
};

export const getCacheKeyFromPath = (path: string): string | undefined => {
  // "/api/v1/product/63acf191825687dbbf35fecc"
  const segments = path.split("/");
  const productSegment = segments.find((segment) =>
    routesWithRedisMiddleware.some((route) => segment === route.path)
  );

  return productSegment;
};
