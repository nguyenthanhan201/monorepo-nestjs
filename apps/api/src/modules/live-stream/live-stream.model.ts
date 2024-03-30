import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import mongoose, { Document } from 'mongoose';

export type LiveStreamDocument = LiveStream & Document;

@Schema({
  timestamps: true,
})
export class LiveStream {
  @Prop()
  @ApiProperty({ type: String, required: true })
  roomId: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  @ApiProperty()
  userId: Object;
}

export const LiveStreamSchema = SchemaFactory.createForClass(LiveStream);
