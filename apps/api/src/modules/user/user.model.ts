import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document } from "mongoose";

export type UserDocument = User & Document;

@Schema({
  timestamps: true,
})
export class User {
  _id: mongoose.Types.ObjectId;

  @Prop({
    required: true,
    unique: true,
  })
  email: string;

  @Prop({
    required: true,
    unique: true,
  })
  name: string;

  @Prop()
  refeshToken?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
