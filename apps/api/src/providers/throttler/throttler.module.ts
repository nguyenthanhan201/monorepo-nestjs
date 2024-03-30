import { Module } from '@nestjs/common';
import { ThrottlerModule, ThrottlerModuleOptions } from '@nestjs/throttler';

const THROTTLE_CONFIG: ThrottlerModuleOptions = {
  throttlers: [
    {
      ttl: 60000, // Time-to-live (in milliseconds) for the throttle
      limit: 20, // Maximum number of requests within the TTL period
    },
  ],
};

@Module({
  imports: [ThrottlerModule.forRoot(THROTTLE_CONFIG)],
})
export class ThrottleModule {}
