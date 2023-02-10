import { IsString } from 'class-validator';

export class DeleteGreetingDto {
  @IsString()
  id: string;
}
