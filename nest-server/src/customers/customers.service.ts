import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class CustomersService {
  constructor(
    @Inject('CUSTOMERS_MICROSERVICE') private readonly client: ClientProxy,
  ) {}
  getCustomer(refreshToken: string) {
    return this.client.send({ cmd: 'get-user' }, refreshToken);
  }
}
