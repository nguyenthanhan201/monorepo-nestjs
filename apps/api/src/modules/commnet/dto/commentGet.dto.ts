import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CommentGetDto {
  @IsNotEmpty()
  @IsString()
  @IsOptional()
  slug: string;

  @IsString()
  @IsOptional()
  parent_slug: string;

  @IsNotEmpty()
  @IsString()
  discuss_id: string;

  // @IsNotEmpty()
  // @IsBoolean()
  // replies: boolean;

  // @IsNotEmpty()
  // @IsNumber()
  // limit: number;
}
