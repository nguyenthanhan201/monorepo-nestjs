import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { CommentConroller } from "./comment.controller";
import { Comment, CommentSchema } from "./comment.model";
import { CommentService } from "./comment.service";

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Comment.name,
        schema: CommentSchema,
      },
    ]),
  ],
  controllers: [CommentConroller],
  providers: [CommentService],
})
export class CommentModule {}
