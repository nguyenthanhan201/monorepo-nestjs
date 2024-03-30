import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { map } from 'rxjs';
import { PushNotificationDto } from './dto/PushNotification.dto';

@Injectable()
export class NotificationService {
  constructor(private httpService: HttpService) {}

  async pushNotification(dto: PushNotificationDto): Promise<any> {
    const { to, notification } = dto;

    const res = this.httpService.post(
      process.env.FCM_URL,
      {
        to,
        notification,
      },
      {
        headers: {
          Authorization: `key=${process.env.FCM_SERVER_KEY}`,
          'Content-Type': 'application/json',
        },
      },
    );

    return res.pipe(map((response) => response.data));
  }
}
