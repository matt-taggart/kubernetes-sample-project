import { IsString } from 'class-validator';

export class RegisterGoogleUserDto {
  @IsString()
  accessToken: string;
}
