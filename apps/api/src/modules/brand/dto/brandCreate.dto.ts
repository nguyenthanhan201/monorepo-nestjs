import { IsNotEmpty, IsString } from "class-validator";

export class BrandCreateDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  logo: string;

  @IsNotEmpty()
  @IsString()
  createdByUserId: string;
}
