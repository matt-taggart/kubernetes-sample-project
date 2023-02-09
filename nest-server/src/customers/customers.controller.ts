import { Controller, Get, Req } from '@nestjs/common';
import { Request } from 'express';
import { CustomersService } from './customers.service';

@Controller('v1/customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Get()
  getCustomer(@Req() request: Request) {
    return this.customersService.getCustomer(request.cookies['cc_auth']);
  }
}
