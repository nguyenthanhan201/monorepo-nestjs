import { Controller, Get, Param, Put, Req, Res } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { Public } from "../../common/decorators/allow-unauthorize-request.decorator";
import { RatingService } from "./rating.service";

@ApiTags("Rating")
@Controller("rating")
export class RatingController {
  constructor(private readonly ratingService: RatingService) {}

  @Get("getRatingByIdAuth/:id")
  async getRatingByIdAuth(@Param("id") idAuth: string): Promise<any> {
    return this.ratingService.getRatingByIdAuth(idAuth);
  }

  @Public()
  @Get("getRatingByIdProduct/:id")
  async getRatingByIdProduct(@Param("id") idProduct: string): Promise<any> {
    return this.ratingService.getRatingByIdProduct(idProduct);
  }

  @Put("updateRatingById/:id")
  async updateRatingById(
    @Req() req,
    @Res({
      passthrough: true,
    })
    res
  ): Promise<any> {
    return this.ratingService.updateRatingById(req, res);
  }
}
