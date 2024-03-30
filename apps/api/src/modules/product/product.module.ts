import { BullModule } from "@nestjs/bull";
import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { ProductConsumer } from "../../common/jobs/consumers/product.job.consumer";
import { ProductProducer } from "../../common/jobs/providers/product.job.producer";
import { ProductController } from "./product.controller";
import { ProductSchema } from "./product.model";
import { ProductService } from "./product.service";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: "Product", schema: ProductSchema }]),
    // JwtModule.registerAsync({
    //   useFactory: (configService: ConfigService) => ({
    //     global: true,
    //     secret: configService.get<string>('JWT_SECRET'),
    //     // signOptions: {
    //     //   expiresIn: `${configService.get('JWT_EXPIRATION')}s`,
    //     // },
    //   }),
    //   inject: [ConfigService],
    // }),
    BullModule.registerQueue({
      name: "product",
    }),
  ],
  controllers: [ProductController],
  providers: [ProductService, ProductConsumer, ProductProducer],
})
export class ProductModule {}
