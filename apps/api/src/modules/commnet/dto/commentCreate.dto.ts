import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CommentCreateDto {
  @IsNotEmpty()
  @IsString()
  slug: string;

  @IsString()
  parent_slug: string;

  @IsNotEmpty()
  @IsString()
  discuss_id: string;

  @IsNotEmpty()
  @IsString()
  @IsOptional()
  isDEL: string;

  @IsNotEmpty()
  @IsString()
  text: string;

  @IsNotEmpty()
  @IsString()
  author: string;
}
