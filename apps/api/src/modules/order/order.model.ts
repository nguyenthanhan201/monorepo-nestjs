import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import mongoose, { Document } from 'mongoose';

export type OrderDocument = Order & Document;

@Schema({
  timestamps: true,
})
export class Order {
  @Prop()
  @ApiProperty({ type: String, required: true })
  idAuth: string;

  @Prop({ type: mongoose.Schema.Types.Mixed })
  @ApiProperty()
  order: any;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
