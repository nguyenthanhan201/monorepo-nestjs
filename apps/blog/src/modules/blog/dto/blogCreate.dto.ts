import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class BlogCreateDto {
  @IsNotEmpty()
  @IsString()
  @IsOptional()
  title: string;

  @IsString()
  @IsOptional()
  thumbnail: string = "";

  @IsString()
  @IsOptional()
  content: string = "";

  @IsString()
  @IsOptional()
  videoURL: string = "";
}
