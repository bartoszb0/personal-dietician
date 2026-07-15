import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';
export class RegisterDto {
  @IsEmail()
  declare email: string;

  @IsString()
  @MinLength(6)
  @MaxLength(24)
  declare password: string;

  @IsString()
  @MinLength(6)
  @MaxLength(24)
  declare confirmPassword: string;
}
