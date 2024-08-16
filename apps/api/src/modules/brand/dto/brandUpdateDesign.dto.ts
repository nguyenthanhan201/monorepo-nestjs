import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class BrandUpdateDesignDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: "design",
  })
  design: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: "preview",
  })
  preview: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: "uid",
  })
  brandId: string;
}
