import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CreateImageDto } from './dto/create-image.dto';

@Injectable()
export class ImagesService {
  constructor(
    @Inject('IMAGES_MICROSERVICE') private readonly client: ClientProxy,
  ) {}

  create(createImageDto: CreateImageDto) {
    return this.client.send({ cmd: 'create' }, createImageDto);
  }

  webhook(webhookPayload: any) {
    return this.client.send({ cmd: 'create' }, webhookPayload);
  }

  findAll() {
    return this.client.send({ cmd: 'findAll' }, null);
  }
}
