import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export type ItemProductDocument = ItemProduct & Document;
export type ItemOrderDocument = ItemOrder & Document;

@Schema({
  timestamps: true,
})
export class ItemProduct {
  @Prop({ type: String, require: true, maxLength: 255 })
  title: string;

  @Prop({ type: String, require: true, maxLength: 255 })
  price: string;

  @Prop({ type: Number, require: true })
  stock: number;

  @Prop({ type: String, require: true, maxLength: 255 })
  image01: string;

  @Prop({ type: String, require: true, maxLength: 255 })
  image02: string;

  @Prop({ type: String, require: true, maxLength: 255 })
  categorySlug: string;

  @Prop({ type: [], require: true, maxLength: 255 })
  colors: Array<string>;

  @Prop({ type: String, slug: 'title', unique: true })
  slug: string;

  @Prop({ type: [], require: true, maxLength: 255 })
  size: Array<string>;

  @Prop({ type: String, require: true, maxLength: 1500 })
  description: string;

  @Prop({ type: Number, default: 0 })
  views: number;

  @Prop({ type: Number, default: null })
  discount: number;

  @Prop({
    type: Date,
    default: null,
  })
  deletedAt: Date;
}

@Schema({
  timestamps: true,
})
export class ItemOrder {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Auth' })
  idAuth: string;

  @Prop({
    type: ItemProduct,
    required: true,
  })
  product: { type: ItemProduct; require: true };

  @Prop({ type: String, require: true, maxLength: 255 })
  price: string;

  @Prop({ type: String, require: true, maxLength: 255 })
  size: string;

  @Prop({ type: String, require: true, maxLength: 255 })
  color: string;

  @Prop({ type: Number, require: true })
  quantity: number;
}

export const ItemProductSchema = SchemaFactory.createForClass(ItemProduct);
export const ItemOrderSchema = SchemaFactory.createForClass(ItemOrder);
