import { IsNotEmpty, IsString } from "class-validator";

export class BlogCreateDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsString()
  thumbnail: string = "";

  @IsString()
  content: string = "";

  @IsString()
  videoURL: string = "";
}
