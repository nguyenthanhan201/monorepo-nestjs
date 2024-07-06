import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Blog } from "../../modules/blog/blog.entity";

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        type: "postgres",
        url: configService.get<string>("POSTGRES_URI"),
        entities: [Blog],
        synchronize: true,
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
