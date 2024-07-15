import { ServerError } from "@app/shared/core/error.response";
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Comment, CommentDocument } from "./comment.model";
import { CommentCreateDto } from "./dto/commentCreate.dto";
import { CommentGetDto } from "./dto/commentGet.dto";

@Injectable()
export class CommentService {
  constructor(
    @InjectModel(Comment.name)
    private readonly commentModal: Model<CommentDocument>
  ) {}

  async getAllComments() {
    try {
      const comments = await this.commentModal.find().lean();
      return comments;
    } catch (error) {
      throw new ServerError(error);
    }
  }

  async getComments({ slug, parent_slug, discuss_id }: CommentGetDto) {
    try {
      const match = {
        ...(discuss_id && { discuss_id }),
        ...(slug && { full_slug: new RegExp(slug, "i") }),
        ...(parent_slug && { parent_slug }),
      };

      const comments = await this.commentModal
        .find(match)
        .sort({ full_slug: 1 })
        .lean();

      return comments;
    } catch (error) {
      throw new ServerError(error);
    }
  }

  async putComment({
    isDEL = "NO",
    discuss_id = "",
    text = "",
    parent_slug = "",
    slug = "1000",
    author = "",
  }: CommentCreateDto) {
    try {
      if (isDEL === "YES") {
        await this.commentModal.deleteMany();
      }

      // 1. Create full_slug = posted + slug
      let full_slug = `${new Date().toISOString()}:${slug}`;
      const parentSlug = await this.commentModal.findOne({
        discuss_id,
        slug: parent_slug,
      });

      if (parentSlug) {
        full_slug = `${parentSlug.full_slug}/${full_slug}`;
        slug = `${parentSlug.slug}/${slug}`;
      }

      const comment = await this.commentModal.create({
        parent_slug,
        discuss_id,
        text,
        full_slug,
        slug,
        author,
      });

      return comment;
    } catch (error) {
      throw new ServerError(error);
    }
  }
}
