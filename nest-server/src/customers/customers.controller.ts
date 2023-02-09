import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { AuthGuard } from 'src/auth.guard';
import { CustomersService } from './customers.service';

@Controller('v1/customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Get()
  @UseGuards(new AuthGuard())
  getCustomer(@Req() request: Request) {
    return this.customersService.getCustomer(request.cookies['cc_auth']);
  }
}
