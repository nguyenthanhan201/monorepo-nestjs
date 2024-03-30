import { DynamicModule, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { RmqService } from './rmq.service';

interface RmqModuleOptions {
  name: string;
}

@Module({
  providers: [RmqService],
  exports: [RmqService],
})
export class RmqModule {
  static register({ name }: RmqModuleOptions): DynamicModule {
    const NAME_QUEUE = process.env.RABBIT_MQ_SERVICE_QUEUE;
    return {
      module: RmqModule,
      imports: [
        ClientsModule.registerAsync([
          {
            name: NAME_QUEUE,
            useFactory: (configService: ConfigService) => ({
              transport: Transport.RMQ,
              options: {
                urls: [configService.get<string>('RABBIT_MQ_URI')],
                queue: name,
                noAck: false, // when producer send message to consumer and consumer receive message, consumer send ack to producer, if noAck is true, consumer not send ack to producer
                expriration: 10000, // 10s
                queueOptions: {
                  durable: true, // if true, when rabbitmq server down, message will not lost
                },
                persistent: true, // if true, when rabbitmq server down, message will not lost
              },
            }),
            inject: [ConfigService],
          },
        ]),
      ],
      exports: [ClientsModule],
    };
  }
}
