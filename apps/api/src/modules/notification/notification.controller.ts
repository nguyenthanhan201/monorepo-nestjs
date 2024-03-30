import { Body, Controller, Post } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { Public } from "../../common/decorators/allow-unauthorize-request.decorator";
import { PushNotificationDto } from "./dto/PushNotification.dto";
import { NotificationService } from "./notificaiton.service";

@ApiTags("Notification")
@Controller("notification")
export class NotificationController {
  constructor(private notificationService: NotificationService) {}

  @Public()
  @Post("push-notification")
  @ApiOperation({ summary: "Push message to current device" })
  @ApiResponse({
    status: 200,
    description: "Push message to current device",
  })
  @ApiResponse({ status: 403, description: "Forbidden." })
  async pushNotification(@Body() body: PushNotificationDto) {
    return await this.notificationService.pushNotification(body);
  }
}
