import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Image, ImageSchema } from './schema/image.schema';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://mongodb-cluster-ip-service/card_couture'),
    MongooseModule.forFeatureAsync([
      {
        name: Image.name,
        useFactory: () => {
          const schema = ImageSchema;
          return schema;
        },
      },
    ]),

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
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
