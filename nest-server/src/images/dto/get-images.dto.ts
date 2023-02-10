import { IsString } from 'class-validator';

export class GetImagesDto {
  @IsString()
  userId: string;
}
