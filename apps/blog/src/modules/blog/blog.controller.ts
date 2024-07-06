import { Body, Controller, Get, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { BlogService } from "./blog.service";
import { BlogCreateDto } from "./dto/blogCreate.dto";

@ApiTags("Blog")
@Controller()
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Post()
  createPoll(@Body() body: BlogCreateDto) {
    return this.blogService.createBlog(body);
  }

  @Get()
  getAllPolls() {
    return this.blogService.getAllBlogs();
  }
}
