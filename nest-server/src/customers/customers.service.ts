import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { catchError, of } from 'rxjs';
import { GetCustomerDto } from './dto/get-customer.dto';

@Injectable()
export class CustomersService {
  constructor(
    @Inject('CUSTOMERS_MICROSERVICE') private readonly client: ClientProxy,
  ) {}
  getCustomer({ userId }: GetCustomerDto) {
    return this.client.send({ cmd: 'get-customer' }, { userId }).pipe(
      catchError((error) => {
        return of(error.response);
      }),
    );
  }
}
