import { SuccessResponse } from "@app/shared/core/success.response";
import { Body, Controller, Get, Param, Post, Res } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { Response } from "express";
import { BlogService } from "./blog.service";
import { BlogCreateDto } from "./dto/blogCreate.dto";

@ApiTags("Blog")
@Controller()
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Post()
  async createPoll(@Res() res: Response, @Body() body: BlogCreateDto) {
    new SuccessResponse({
      message: "Blog created",
      metadata: await this.blogService.createBlog(body),
    }).send(res);
  }

  @Get()
  async getAllPolls(@Res() res: Response) {
    new SuccessResponse({
      message: "Get all blogs",
      metadata: await this.blogService.getAllBlogs(),
    }).send(res);
    // return await this.blogService.getAllBlogs();
  }

  @Get(":id")
  async getDetailBlog(@Res() res: Response, @Param("id") id: string) {
    // console.log("👌  id:", id);

    if (!id) return;

    new SuccessResponse({
      message: "Get detail blog",
      metadata: await this.blogService.getDetailBlog(id),
    }).send(res);
  }
}
