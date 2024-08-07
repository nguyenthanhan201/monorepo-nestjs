import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>("MONGODB_URI"),
        autoCreate: true,
        // connectionFactory: (connection) => {
        //   connection.plugin(slug);
        //   return connection;
        // },
      }),
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}

// type: "postgres",
// host: "aws-0-ap-southeast-1.pooler.supabase.com",
// port: 6543,
// username: "postgres.qyruvrpvtuvshysvrtcx",
// password: "xQ1IWya0nK1uYiYX",
// database: "postgres",
