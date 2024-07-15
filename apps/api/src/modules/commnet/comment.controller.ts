import { SuccessResponse } from "@app/shared/core/success.response";
import { Body, Controller, Post, Res } from "@nestjs/common";
import { Response } from "express";
import { Public } from "../../common/decorators/allow-unauthorize-request.decorator";
import { CommentService } from "./comment.service";
import { CommentCreateDto } from "./dto/commentCreate.dto";
import { CommentGetDto } from "./dto/commentGet.dto";

@Public()
@Controller("comment")
export class CommentConroller {
  constructor(private readonly commentService: CommentService) {}

  @Post("comments")
  async getComments(@Res() res: Response, @Body() body: CommentGetDto) {
    new SuccessResponse({
      message: "Get list comments ok",
      metadata: await this.commentService.getComments(body),
    }).send(res);
  }

  @Post("put-comment")
  async putComment(@Res() res: Response, @Body() body: CommentCreateDto) {
    new SuccessResponse({
      message: "Comment created",
      metadata: await this.commentService.putComment(body),
    }).send(res);
  }
}
