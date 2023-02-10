import { IsString } from 'class-validator';

export class CreateGreetingDto {
  @IsString()
  prompt: string;
}
