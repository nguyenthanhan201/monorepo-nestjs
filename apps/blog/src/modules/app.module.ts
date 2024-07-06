import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import * as Joi from "joi";
import { DatabaseModule } from "../providers/database/database.module";
import { BlogModule } from "./blog/blog.module";

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
    DatabaseModule,
    BlogModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
