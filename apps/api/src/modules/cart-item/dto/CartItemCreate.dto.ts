import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CartItemCreateDto {
  @IsNotEmpty()
  @IsString()
  color: string;

  @IsNotEmpty()
  @IsString()
  idAuth: string;

  @IsNotEmpty()
  @IsString()
  idProduct: string;

  @IsNotEmpty()
  @IsNumber()
  quantity: number;

  @IsNotEmpty()
  @IsString()
  size: string;
}
