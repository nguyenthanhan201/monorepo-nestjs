import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { BlogController } from "./blog.controller";
import { Blog } from "./blog.entity";
import { BlogService } from "./blog.service";

@Module({
  imports: [
    // Add the Poll entity to the imports array
    TypeOrmModule.forFeature([Blog]),
  ],
  providers: [BlogService],
  controllers: [BlogController],
})
export class PollModule {}
