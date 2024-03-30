import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RatingController } from './rating.controller';
import { RatingSchema } from './rating.model';
import { RatingService } from './rating.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Rating', schema: RatingSchema }]),
  ],
  providers: [RatingService],
  controllers: [RatingController],
})
export class RatingModule {}
