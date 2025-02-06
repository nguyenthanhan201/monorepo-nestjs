import { SuccessResponse } from "@app/shared/core/success.response";
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Req,
  Res,
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { Request, Response } from "express";
import { Public } from "../../common/decorators/allow-unauthorize-request.decorator";
import { GetUser } from "../../common/decorators/get-user.decorator";
import { convertToObjectIdMongodb } from "../../common/utils";
import { getCacheKeyFromPath } from "../../common/utils/redis";
import { User } from "../user/user.model";
import { BrandService } from "./brand.service";
import { BrandCreateDto } from "./dto/brandCreate.dto";
import { BrandUpdateDesignDto } from "./dto/brandUpdateDesign.dto";

@Controller("brand")
@ApiTags("brand")
export class BrandController {
  constructor(private readonly brandService: BrandService) {}

  @Public()
  @Get("")
  async getAllBrands(@Req() req: Request, @Res() res: Response) {
    const key = getCacheKeyFromPath(req.path);

    new SuccessResponse({
      message: "List brand OK",
      metadata: await this.brandService.getAllBrands(key),
    }).send(res);
  }

  @Public()
  @Get("getOneBrand/:brandId")
  getOneBrand(@Param("brandId") brandId: string) {
    return this.brandService.getOneBrand(brandId);
  }

  @Get("getBrandsByUserId")
  getAllBrandsByUserId(@GetUser() userInfo: User) {
    return this.brandService.getAllBrandsByUserId(userInfo._id);
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
