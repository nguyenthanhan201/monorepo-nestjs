import { ApiProperty } from "@nestjs/swagger";
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from "class-validator";

export class ProductCreateDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: "Adidas",
  })
  title: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: "",
  })
  image01: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: "",
  })
  image02: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: "",
  })
  price: string;

  // @IsNotEmpty()
  // @IsString()
  // slug: string;

  @IsNotEmpty()
  @IsArray()
  @ApiProperty({
    example: ["S", "M", "L", "XL"],
  })
  size: Array<string>;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: "adidas",
  })
  categorySlug: string;

  @IsNotEmpty()
  @IsArray()
  @ApiProperty({
    example: ["red", "blue", "green"],
  })
  colors: Array<string>;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: "Adidas",
  })
  description: string;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({
    example: 10,
  })
  stock: number;

  @IsNotEmpty()
  @IsNumber()
  @IsOptional()
  discount?: number;
}
