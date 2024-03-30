import { CacheModule } from "@nestjs/cache-manager";
import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { redisStore } from "cache-manager-redis-store";

@Module({
  imports: [
    // CacheModule.registerAsync({
    //   isGlobal: true,
    //   imports: [ConfigModule],
    //   useFactory: async (configService: ConfigService) => ({
    //     store: await redisStore({
    //       url: configService.get<string>("REDIS_URI"),
    //     }),
    //   }),
    //   // useClass: ConfigService,
    //   inject: [ConfigService],
    // }),
    CacheModule.registerAsync({
      useFactory: async (configService: ConfigService) =>
        ({
          store: await redisStore({
            // legacyMode: true,
            // url: "redis://localhost:6379",
            url: configService.get<string>("REDIS_URI"),
            // socket: {
            //   port: 6379,
            //   host: "host.docker.internal",
            // },
          }),
        }) as any,
      isGlobal: true,
      inject: [ConfigService],
    }),
  ],
})
export class RedisModule {}
