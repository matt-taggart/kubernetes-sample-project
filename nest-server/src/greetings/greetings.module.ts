import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { GreetingsService } from './greetings.service';
import { GreetingsController } from './greetings.controller';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'GREETINGS_MICROSERVICE',
        transport: Transport.REDIS,
        options: {
          host: 'redis-cluster-ip-service',
          port: 6379,
        },
      },
    ]),
  ],
  controllers: [GreetingsController],
  providers: [GreetingsService],
})
export class GreetingsModule {}
