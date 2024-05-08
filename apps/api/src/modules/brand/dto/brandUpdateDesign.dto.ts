import { IsNotEmpty, IsString } from "class-validator";

export class BrandUpdateDesignDto {
  @IsNotEmpty()
  @IsString()
  design: string;

  @IsNotEmpty()
  @IsString()
  preview: string;

  @IsNotEmpty()
  @IsString()
  brandId: string;
}
