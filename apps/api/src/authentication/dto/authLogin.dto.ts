import { IsNotEmpty, IsString } from "class-validator";

export class AuthLoginDto {
  // @IsNotEmpty()
  // @IsEmail()
  // email: string;
  // @IsNotEmpty()
  // @IsString()
  // name: string;
  @IsNotEmpty()
  @IsString()
  providerToken: string;

  @IsNotEmpty()
  @IsString()
  providerType: "firebase" | "supabase";
}
