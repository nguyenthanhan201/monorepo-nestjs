import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { getMetadataArgsStorage } from "typeorm";

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => {
        const entities = getMetadataArgsStorage()
          .tables.map((tbl) => tbl.target as Function)
          .filter((entity) =>
            entity.toString().toLowerCase().includes("entity")
          );

        return {
          type: "postgres",
          url: configService.get<string>("POSTGRES_URI"),
          entities,
          synchronize: true,
          maxQueryExecutionTime: 1000,
        };
      },
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
