import { SuccessResponse } from "@app/shared/core/success.response";
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Res,
} from "@nestjs/common";
import { ApiProperty, ApiResponse, ApiTags } from "@nestjs/swagger";
import { Response } from "express";
import { Public } from "../../common/decorators/allow-unauthorize-request.decorator";
import { ProductCreateDto } from "./dto/productCreate.dto";
import { ProductService } from "./product.service";

@ApiTags("Product")
@Controller("product")
export class ProductController {
  constructor(private productService: ProductService) {}

  @Public()
  // @Get("getAllProducts/:key")
  @Get("getAllProducts/:key")
  // @ApiOperation({ summary: "Search product in elastic search" })
  @ApiResponse({
    status: 200,
    description: "Search product in elastic search",
  })
  @ApiResponse({ status: 403, description: "Forbidden." })
  async getAllProducts(@Res() res: Response, @Param("key") key: string) {
    new SuccessResponse({
      message: "List product OK",
      metadata: await this.productService.getAllProducts(key),
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
  createProduct(@Body() body: ProductCreateDto) {
    return this.productService.createProduct(body);
  }

  @Put(":id")
  @ApiProperty()
  updateProductByIdProduct(
    @Body() body: ProductCreateDto,
    @Param("id") id: string
  ) {
    return this.productService.updateProductByIdProduct(body, id);
  }

  @Put("hide/:id")
  hideProductByIdProduct(@Param("id") id: string) {
    return this.productService.hideProductByIdProduct(id);
  }

  @Put("unhide/:id")
  unhideProductByIdProduct(@Param("id") id: string) {
    return this.productService.unhideProductByIdProduct(id);
  }

  @Delete()
  deleteProductByIdProduct(@Param("id") id: string) {
    return this.productService.unhideProductByIdProduct(id);
  }

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
