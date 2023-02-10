import { IsString } from 'class-validator';

export class GetCustomerDto {
  @IsString()
  userId: string;
}
