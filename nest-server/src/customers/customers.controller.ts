import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth.guard';
import { AuthenticatedRequest } from 'src/types';
import { CustomersService } from './customers.service';

@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Get()
  @UseGuards(new AuthGuard())
  getCustomer(@Req() request: AuthenticatedRequest) {
    return this.customersService.getCustomer({ userId: request.userId });
  }
}
