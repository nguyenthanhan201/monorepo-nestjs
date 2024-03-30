// To test the microservice, we need to comment code all providers in src/modules/app.module.ts because createMicroservice not return request and response object

import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { AppModule } from './modules/app.module';
require('dotenv').config();

async function bootstrap() {
  const rabbitUrl = process.env.RABBIT_MQ_URI;

  if (!rabbitUrl) {
    console.error('RABBIT_MQ_URI environment variable not set!');
    return;
  }

  const app = await NestFactory.createMicroservice(AppModule, {
    transport: Transport.RMQ,
    options: {
      urls: [rabbitUrl],
      queue: 'hello',
      queueOptions: {
        durable: true,
      },
    },
  });

  app.listen().then(() => console.log('Microservice is listening'));
}
bootstrap();
