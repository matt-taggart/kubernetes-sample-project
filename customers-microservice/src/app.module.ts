import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Customer, CustomerSchema } from './schemas/customer.schema';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://mongodb-cluster-ip-service/card_couture'),
    MongooseModule.forFeatureAsync([
      {
        name: Customer.name,
        useFactory: () => {
          const schema = CustomerSchema;
          return schema;
        },
      },
    ]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
