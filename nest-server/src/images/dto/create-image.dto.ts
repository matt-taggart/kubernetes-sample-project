import { IsString } from 'class-validator';

export class CreateImageDto {
  @IsString()
  prompt: string;

  @IsString()
  model: string;
}
