import { MiddlewareConsumer, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { APP_GUARD } from "@nestjs/core";
import { JwtModule } from "@nestjs/jwt";
import { ThrottlerGuard } from "@nestjs/throttler";
import * as Joi from "joi";
import { AuthModule } from "../authentication/auth.module";
import { AuthGuard } from "../common/guards/auth.guard";
import { LogResponseMiddleware } from "../common/middlewares/logResponse.middleware";
import {
  DatabaseModule,
  GlobalHttpModule,
  QueueModule,
  RedisModule,
  ThrottleModule,
} from "../providers";
import { AppController } from "./app.controller";
import { CartItemModule } from "./cart-item/cart-item.module";
import { EmailModule } from "./email/email.module";
import { LiveStreamModule } from "./live-stream/live-stream.module";
import { NotificationModel } from "./notification/notification.module";
import { OrderModule } from "./order/order.module";
import { ProductModule } from "./product/product.module";
import { RatingModule } from "./rating/rating.module";
import { ScrapperModule } from "./scrapper/scrapper.module";
// import { TrancoderModule } from "./trancoder/trancoder.module";
import { routesWithRedisMiddleware } from "../common/constants/getRedisCacheRouters";
import { RedisMiddleware } from "../common/middlewares/redis.middleware";
import { BrandModule } from "./brand/brand.module";
import { CommentModule } from "./commnet/comment.module";
import { UploadModule } from "./upload/upload.module";
import { UserModule } from "./user/user.module";
require("dotenv").config();

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        // MONGODB_URI: Joi.string().required(),
        // PORT: Joi.number().required(),
      }),
      envFilePath: ".env",
    }),
    // MulterModule.register({
    // dest: "./uploads",
    // storage: multer.memoryStorage(),
    // }),
    GlobalHttpModule,
    RedisModule,
    QueueModule,
    DatabaseModule,
    ThrottleModule,
    // SearchModule,
    ProductModule,
    ScrapperModule,
    UserModule,
    AuthModule,
    CartItemModule,
    RatingModule,
    OrderModule,
    EmailModule,
    JwtModule,
    UploadModule,
    NotificationModel,
    LiveStreamModule,
    BrandModule,
    CommentModule,
    // AddNewModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(LogResponseMiddleware).forRoutes("*");
    // consumer.apply(ReverseProxyAuthMiddleware).forRoutes({
    //   path: 'app',
    //   method: RequestMethod.ALL,
    // });
    consumer.apply(RedisMiddleware).forRoutes(...routesWithRedisMiddleware);
  }
}
