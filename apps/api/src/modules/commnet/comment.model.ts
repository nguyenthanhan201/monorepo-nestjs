import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { BaseModel } from "../../common/base/base.model";

export type CommentDocument = Comment & Document;

@Schema({
  timestamps: {
    createdAt: "createdAt",
    updatedAt: "updatedAt",
  },
})
export class Comment extends BaseModel {
  // @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "Author" })
  // author: object;

  @Prop({
    required: true,
  })
  author: string; // userId, avatar, name, ...

  @Prop({
    required: true,
  })
  discuss_id: string; // id a post

  @Prop({
    required: true,
    default: "",
  })
  text: string;

  @Prop({
    default: "",
  })
  parent_slug: string; // comment parent if have, default is ''

  @Prop()
  score: number;

  @Prop({
    required: true,
  })
  slug: string;

  @Prop()
  comment_likes: Array<any>;

  @Prop()
  comment_like_num: number;

  @Prop({
    required: true,
  })
  full_slug: string; // combine posted + slug
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
