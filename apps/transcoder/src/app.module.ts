import { FirebaseService } from "@app/shared/services/firebase.service";
import { TrancoderService } from "@app/shared/services/trancoder.service";
import { UploadService } from "@app/shared/services/upload.service";
import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { ClientProxyFactory, Transport } from "@nestjs/microservices";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      // validationSchema: Joi.object({
      //   // MONGODB_URI: Joi.string().required(),
      //   // PORT: Joi.number().required(),
      // }),
      envFilePath: ".env",
    }),
    // RmqModule.register({
    //   name: 'get-user',
    // }),
  ],
  providers: [
    AppService,
    TrancoderService,
    FirebaseService,
    UploadService,
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
  controllers: [AppController],
})
export class AppModule {}
