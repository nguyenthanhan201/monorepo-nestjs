import { IsNotEmpty, IsString } from 'class-validator';

export class CartItemDeleteDto {
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
  @IsString()
  size: string;
}
