import {
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsString,
  Max,
  Min,
} from "class-validator";

export class OrderCreatePaymentDto {
  @IsNotEmpty()
  @IsNumber()
  @Min(10000)
  @Max(40000000)
  amount: number;

  @IsNotEmpty()
  @IsObject()
  cartItems: any;

  @IsNotEmpty()
  @IsString()
  paymentType: "vnpay" | "momo" | "zalopay";
}
