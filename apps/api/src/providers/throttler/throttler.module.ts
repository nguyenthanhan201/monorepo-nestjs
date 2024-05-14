import { Module } from "@nestjs/common";
import { ThrottlerModule, ThrottlerModuleOptions } from "@nestjs/throttler";

const THROTTLE_CONFIG: ThrottlerModuleOptions = {
  throttlers: [
    {
      name: "medium",
      ttl: 10000, // Time-to-live (in milliseconds) for the throttle
      limit: 20, // Maximum number of requests within the TTL period
    },
    // {
    //   name: "short",
    //   ttl: 1000,
    //   limit: 3,
    // },
    // {
    //   name: "medium",
    //   ttl: 10000,
    //   limit: 20,
    // },
    // {
    //   name: "long",
    //   ttl: 60000,
    //   limit: 100,
    // },
  ],
};

@Module({
  imports: [ThrottlerModule.forRoot(THROTTLE_CONFIG)],
})
export class ThrottleModule {}
