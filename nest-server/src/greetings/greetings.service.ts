import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CreateGreetingDto } from './dto/create-greeting.dto';

@Injectable()
export class GreetingsService {
  constructor(
    @Inject('GREETINGS_MICROSERVICE') private readonly client: ClientProxy,
  ) {}

  create(createGreetingDto: CreateGreetingDto) {
    return this.client.send({ cmd: 'create' }, createGreetingDto);
  }

  findAll() {
    return this.client.send({ cmd: 'findAll' }, null);
  }

  remove(id: string) {
    return this.client.send({ cmd: 'remove' }, id);
  }
}
