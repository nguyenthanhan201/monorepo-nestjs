import { Module } from '@nestjs/common';
import { NotificationService } from './notificaiton.service';
import { NotificationController } from './notification.controller';

@Module({
  imports: [],
  controllers: [NotificationController],
  providers: [NotificationService],
})
export class NotificationModel {}
