import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import mongoose, { Document } from 'mongoose';

export type RatingDocument = Rating & Document;

@Schema({
  timestamps: true,
})
export class Rating {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  })
  @ApiProperty()
  idAuth: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
  })
  idProduct: string;

  @Prop({
    default: '',
  })
  comment: string;

  @Prop({
    default: 0,
  })
  rating: number;
}

export const RatingSchema = SchemaFactory.createForClass(Rating);
