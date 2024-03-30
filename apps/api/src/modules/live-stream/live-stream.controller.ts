import { Controller, Get, HttpCode, HttpStatus } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
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
  getRoomByUserId(@GetUser() userInfo: User) {
    return this.liveStreamService.getLiveStreamByUserId(
      convertToObjectIdMongodb(userInfo._id)
    );
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Get("all")
  getAllRooms() {
    return this.liveStreamService.getAllRooms();
  }
}
