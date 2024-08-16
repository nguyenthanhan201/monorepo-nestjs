import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class AuthLoginDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: "firebase",
  })
  providerToken: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: "firebase",
  })
  providerType: "firebase" | "supabase";
}

export class AuthLoginDevDto {
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({
    example: "fxannguyen201@gmail.com",
  })
  email: string;
}
