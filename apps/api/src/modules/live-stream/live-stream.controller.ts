import { SuccessResponse } from "@app/shared/core/success.response";
import { Controller, Get, HttpCode, HttpStatus, Res } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { Response } from "express";
import { Public } from "../../common/decorators/allow-unauthorize-request.decorator";
import { GetUser } from "../../common/decorators/get-user.decorator";
import { convertToObjectIdMongodb } from "../../common/utils";
import { User } from "../user/user.model";
import { LiveStreamService } from "./live-stream.service";

@ApiTags("LiveStream")
@Controller("live-stream")
export class LiveStreamController {
  constructor(private readonly liveStreamService: LiveStreamService) {}

  @HttpCode(HttpStatus.OK)
  @Get("")
  getRoomByUserId(@Res() res: Response, @GetUser() userInfo: User) {
    new SuccessResponse({
      message: "Get room by user id OK",
      metadata: this.liveStreamService.getLiveStreamByUserId(
        convertToObjectIdMongodb(userInfo._id)
      ),
    }).send(res);
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Get("all")
  getAllRooms(@Res() res: Response) {
    new SuccessResponse({
      message: "Get all rooms OK",
      metadata: this.liveStreamService.getAllRooms(),
    }).send(res);
  }
}
