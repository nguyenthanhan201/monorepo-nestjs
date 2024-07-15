import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Blog } from "./blog.entity";
import { BlogCreateDto } from "./dto/blogCreate.dto";

@Injectable()
export class BlogService {
  constructor(
    @InjectRepository(Blog)
    private readonly blogRepository: Repository<Blog>
  ) {}

  async createBlog(params: BlogCreateDto): Promise<Blog> {
    const poll = this.blogRepository.create(params);
    return this.blogRepository.save(poll);
  }

  async getAllBlogs(): Promise<Blog[]> {
    return this.blogRepository.find();
  }

  async getDetailBlog(id: string): Promise<Blog> {
    return this.blogRepository.findOne({
      where: { id },
    });
  }
}
