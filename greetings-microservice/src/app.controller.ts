import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { AppService } from './app.service';
import { CreateGreetingDto } from './dto/create-greeting.dto';
import { DeleteGreetingDto } from './dto/delete-greeting.dto';
import { GetGreetingsDto } from './dto/get-greetings.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern({ cmd: 'create-greeting' })
  createGreeting(createGreetingDto: CreateGreetingDto): Promise<any> {
    return this.appService.createGreeting(createGreetingDto);
  }

  @MessagePattern({ cmd: 'get-greetings' })
  getGreetings(getGreetingsDto: GetGreetingsDto) {
    return this.appService.getGreetings(getGreetingsDto);
  }

  @MessagePattern({ cmd: 'delete-greeting' })
  deleteGreeting(deleteGreetingDto: DeleteGreetingDto): Promise<any> {
    return this.appService.deleteGreeting(deleteGreetingDto);
  }
}
