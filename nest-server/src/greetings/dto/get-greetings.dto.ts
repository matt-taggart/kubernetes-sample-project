import { IsString } from 'class-validator';

export class GetGreetingsDto {
  @IsString()
  userId: string;
}
