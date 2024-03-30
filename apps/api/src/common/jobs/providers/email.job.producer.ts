import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';

@Injectable()
export class EmailProducer {
  constructor(@InjectQueue('send-mail') private readonly sendMail: Queue) {}

  async sendMessage(toEmail: string) {
    await this.sendMail.add(
      'register',
      {
        email: toEmail,
      },
      {
        removeOnComplete: true,
        delay: 1000,
      },
    );
  }
}
