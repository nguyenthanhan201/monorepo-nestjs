import { Type } from 'class-transformer';
import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';

class Notification {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  body: string;
}

export class PushNotificationDto {
  @IsNotEmpty()
  @IsString()
  to: string;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => Notification)
  notification: Notification;
}
