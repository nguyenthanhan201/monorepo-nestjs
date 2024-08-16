import { cacheModules } from "../constants/cacheModules";

export const getCacheKey = (path: string) => {
  return path.split("/").pop();
};

export const getCacheKeyFromPath = (path: string): string | undefined => {
  // "/api/v1/product/63acf191825687dbbf35fecc"
  const segments = path.split("/");
  const productSegment = segments.find((segment) =>
    cacheModules.includes(segment)
  );

  return productSegment;
};
