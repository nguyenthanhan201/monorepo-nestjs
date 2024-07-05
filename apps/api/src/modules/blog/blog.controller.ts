import { Body, Controller, Get, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { Public } from "../../common/decorators/allow-unauthorize-request.decorator";
import { Blog } from "./blog.entity";
import { BlogService } from "./blog.service";

@ApiTags("Blog")
@Controller("blog")
@Public()
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Post()
  createPoll(
    @Body()
    body: Blog
  ) {
    return this.blogService.createBlog(body);
  }

  @Get()
  getAllPolls() {
    return this.blogService.getAllBlogs();
  }
}
