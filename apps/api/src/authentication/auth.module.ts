import { FirebaseService } from "@app/shared/services/firebase.service";
import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { ClientProxyFactory, Transport } from "@nestjs/microservices";
import { EmailModule } from "../modules/email/email.module";
import { UserModule } from "../modules/user/user.module";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { JwtStrategy } from "./strategy/jwt.strategy";

@Module({
  imports: [
    UserModule,
    EmailModule,
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        global: true,
        secret: configService.get<string>("JWT_SECRET"),
        // signOptions: {
        //   expiresIn: `${configService.get('JWT_EXPIRATION')}s`,
        // },
      }),
      inject: [ConfigService],
    }),
    // RmqModule.register({
    //   name: 'hello',
    // }),
    // RmqModule.register({
    //   name: 'get-user',
    // }),
  ],
  providers: [
    FirebaseService,
    AuthService,
    JwtStrategy,
    {
      provide: "main_queue",
      useFactory: (configService: ConfigService) => {
        return ClientProxyFactory.create({
          transport: Transport.RMQ,
          options: {
            urls: [configService.get("RABBIT_MQ_URI")],
            queue: configService.get("RABBIT_MQ_SERVICE_QUEUE"),
            queueOptions: {
              durable: true,
            },
          },
        });
      },
      inject: [ConfigService],
    },
  ],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
