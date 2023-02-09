import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ImagesService } from './images.service';
import { ImagesController } from './images.controller';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'IMAGES_MICROSERVICE',
        transport: Transport.REDIS,
        options: {
          host: 'redis-cluster-ip-service',
          port: 6379,
        },
      },
    ]),
  ],
  controllers: [ImagesController],
  providers: [ImagesService],
})
export class ImagesModule {}
