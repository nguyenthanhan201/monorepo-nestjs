import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import mongoose, { Document } from 'mongoose';

export type CartItemDocument = CartItem & Document;

@Schema({
  timestamps: true,
})
export class CartItem {
  @Prop()
  @ApiProperty({ type: String, required: true })
  idAuth: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
  })
  idProduct: string;

  @Prop()
  size: string;

  @Prop()
  color: string;

  @Prop()
  quantity: number;
}

export const CartItemSchema = SchemaFactory.createForClass(CartItem);
