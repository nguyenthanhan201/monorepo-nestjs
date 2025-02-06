import { Controller, Get, Param, Put, Req, Res } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { Public } from "../../common/decorators/allow-unauthorize-request.decorator";
import { GetUser } from "../../common/decorators/get-user.decorator";
import { User } from "../user/user.model";
import { RatingService } from "./rating.service";

@ApiTags("Rating")
@Controller("rating")
export class RatingController {
  constructor(private readonly ratingService: RatingService) {}

  @Get("getRatingByIdAuth")
  async getRatingByIdAuth(@GetUser() userInfo: User): Promise<any> {
    return this.ratingService.getRatingByIdAuth(userInfo._id);
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
