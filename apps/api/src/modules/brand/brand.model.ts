import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";
import mongoose, { Document } from "mongoose";
import { BaseModel } from "../../common/base/base.model";

export type BrandDocument = Brand & Document;

@Schema({
  timestamps: {
    createdAt: "createdAt",
    updatedAt: "updatedAt",
  },
})
export class Brand extends BaseModel {
  @Prop()
  @ApiProperty({ type: String, required: true })
  name: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "User", required: true })
  @ApiProperty()
  createdByUserId: Object;

  @Prop({
    type: String,
    required: true,
    default:
      "https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_960_720.png",
  })
  @ApiProperty()
  logo: string;

  @Prop({ type: String })
  @ApiProperty()
  design: string;

  @Prop({ type: String })
  @ApiProperty()
  preview: string;
}

export const BrandSchema = SchemaFactory.createForClass(Brand);
