import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class LoginDto {
  @IsEmail()
  declare email: string;

  @IsString()
  @MinLength(6)
  @MaxLength(24)
  declare password: string;
}
