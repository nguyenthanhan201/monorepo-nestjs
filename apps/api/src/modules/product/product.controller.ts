import { CREATED, SuccessResponse } from "@app/shared/core/success.response";
import { GenericFilter } from "@app/shared/services/page.service";
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  Res,
} from "@nestjs/common";
import { ApiProperty, ApiResponse, ApiTags } from "@nestjs/swagger";
import { Request, Response } from "express";
import { Public } from "../../common/decorators/allow-unauthorize-request.decorator";
import { getCacheKeyFromPath } from "../../common/utils/redis";
import { ProductCreateDto } from "./dto/productCreate.dto";
import { ProductService } from "./product.service";

@ApiTags("Product")
@Controller("product")
export class ProductController {
  constructor(private productService: ProductService) {}

  @Public()
  @Get("")
  // @ApiOperation({ summary: "Search product in elastic search" })
  @ApiResponse({
    status: 200,
    description: "Search product in elastic search",
  })
  async getProducts(
    @Query() filter: GenericFilter,
    @Req() req: Request,
    @Res() res: Response
  ) {
    const key = getCacheKeyFromPath(req.path);

    const { paginatedProducts } = await this.productService.getProducts(
      filter,
      key
    );

    new SuccessResponse({
      message: "List product OK",
      metadata: paginatedProducts,
    }).send(res);
  }

  // @UseGuards(JwtAuthGuard)
  @Get("hide")
  async getAllHideProducts(@Res() res: Response) {
    new SuccessResponse({
      message: "List hide product OK",
      metadata: await this.productService.getAllHideProducts(),
    }).send(res);
  }

  @Public()
  @Get("slug")
  getAllHideSlugs() {
    // console.log(JSON.stringify(user, null, 2));
    return this.productService.getAllSlugs();
  }

  @Post("store")
  @ApiProperty()
  createProduct(@Res() res: Response, @Body() body: ProductCreateDto) {
    new CREATED({
      message: "Create product OK",
      metadata: this.productService.createProduct(body),
    }).send(res);
  }

  @Put(":id")
  async updateProductByIdProduct(
    @Res() res: Response,
    @Body() body: any,
    @Param("id") id: string
  ) {
    new SuccessResponse({
      message: "Update product OK",
      metadata: await this.productService.updateProductByIdProduct(body, id),
    }).send(res);
  }

  @Put("hide/:id")
  async hideProductByIdProduct(@Res() res: Response, @Param("id") id: string) {
    new SuccessResponse({
      message: "Hide product OK",
      metadata: await this.productService.mostViewed(),
    }).send(res);
  }

  @Put("unhide/:id")
  async unhideProductByIdProduct(
    @Res() res: Response,
    @Param("id") id: string
  ) {
    new SuccessResponse({
      message: "Unhide product OK",
      metadata: await this.productService.mostViewed(),
    }).send(res);
  }

  @Delete()
  deleteProductByIdProduct(@Param("id") id: string) {
    return this.productService.unhideProductByIdProduct(id);
  }

  @Public()
  @Get("most-viewed")
  async mostViewed(@Res() res: Response) {
    new SuccessResponse({
      message: "List most view product OK",
      metadata: await this.productService.mostViewed(),
    }).send(res);
  }

  @Public()
  @Put("most-viewed/:id")
  updateViewedByIdProduct(@Param("id") idProduct: string) {
    return this.productService.updateView(idProduct);
  }
}
