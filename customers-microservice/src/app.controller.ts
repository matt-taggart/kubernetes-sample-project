import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { AppService } from './app.service';
import { GetCustomerDto } from './dto/get-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern({ cmd: 'get-customer' })
  getCustomer(getCustomerDto: GetCustomerDto) {
    return this.appService.getCustomer(getCustomerDto);
  }

  @MessagePattern({ cmd: 'update-customer' })
  updateCustomer(updateCustomerDto: UpdateCustomerDto) {
    return this.appService.updateCustomer(updateCustomerDto);
  }
}
