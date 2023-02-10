import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Greeting, GreetingSchema } from './schemas/greeting.schema';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://mongodb-cluster-ip-service/card_couture'),
    MongooseModule.forFeatureAsync([
      {
        name: Greeting.name,
        useFactory: () => {
          const schema = GreetingSchema;
          return schema;
        },
      },
    ]),

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

    ClientsModule.register([
      {
        name: 'CUSTOMERS_MICROSERVICE',
        transport: Transport.REDIS,
        options: {
          host: 'redis-cluster-ip-service',
          port: 6379,
        },
      },
    ]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
