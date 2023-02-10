import { IsEmail, IsString } from 'class-validator';

export class RegisterUserDto {
  @IsString()
  fullName: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;
}
