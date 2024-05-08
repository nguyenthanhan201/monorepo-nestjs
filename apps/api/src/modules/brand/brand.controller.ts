import { Body, Controller, Get, Param, Post, Put } from "@nestjs/common";
import { Public } from "../../common/decorators/allow-unauthorize-request.decorator";
import { GetUser } from "../../common/decorators/get-user.decorator";
import { convertToObjectIdMongodb } from "../../common/utils";
import { User } from "../user/user.model";
import { BrandService } from "./brand.service";
import { BrandCreateDto } from "./dto/brandCreate.dto";
import { BrandUpdateDesignDto } from "./dto/brandUpdateDesign.dto";

@Controller("brand")
export class BrandController {
  constructor(private readonly brandService: BrandService) {}

  @Public()
  @Get("getAllBrands")
  getAllBrands() {
    return this.brandService.getAllBrands();
  }

  @Public()
  @Get("getOneBrand/:brandId")
  getOneBrand(@Param("brandId") brandId: string) {
    return this.brandService.getOneBrand(brandId);
  }

  @Get("getBrandsByUserId")
  getAllBrandsByUserId(@GetUser() userInfo: User) {
    return this.brandService.getAllBrandsByUserId(
      convertToObjectIdMongodb(userInfo._id)
    );
  }

  @Post("create")
  createBrand(@Body() body: BrandCreateDto) {
    return this.brandService.createBrand(body);
  }

  @Put("updateDesign")
  updateDesign(@Body() body: BrandUpdateDesignDto) {
    return this.brandService.updateDesign(
      convertToObjectIdMongodb(body.brandId),
      body.design,
      body.preview
    );
  }
}
