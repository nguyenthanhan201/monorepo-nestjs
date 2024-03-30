import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LiveStreamController } from './live-stream.controller';
import { LiveStreamSchema } from './live-stream.model';
import { LiveStreamService } from './live-stream.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'LiveStream', schema: LiveStreamSchema },
    ]),
  ],
  controllers: [LiveStreamController],
  providers: [LiveStreamService],
})
export class LiveStreamModule {}
