import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class ProductCreateDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  image01: string;

  @IsNotEmpty()
  @IsString()
  image02: string;

  @IsNotEmpty()
  @IsString()
  price: string;

  // @IsNotEmpty()
  // @IsString()
  // slug: string;

  @IsNotEmpty()
  @IsArray()
  size: Array<string>;

  @IsNotEmpty()
  @IsString()
  categorySlug: string;

  @IsNotEmpty()
  @IsArray()
  colors: Array<string>;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsNumber()
  stock: number;

  @IsNotEmpty()
  @IsNumber()
  @IsOptional()
  discount?: number;
}
