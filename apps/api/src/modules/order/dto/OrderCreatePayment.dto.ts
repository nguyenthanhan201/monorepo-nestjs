import { IsNotEmpty, IsNumber, IsObject } from 'class-validator';

export class OrderCreatePaymentDto {
  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @IsNotEmpty()
  @IsObject()
  cartItems: any;
}
