import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { BrandController } from "./brand.controller";
import { Brand, BrandSchema } from "./brand.model";
import { BrandService } from "./brand.service";

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Brand.name,
        schema: BrandSchema,
      },
    ]),
  ],
  controllers: [BrandController],
  providers: [BrandService],
})
export class BrandModule {}
