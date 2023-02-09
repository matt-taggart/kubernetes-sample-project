import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import * as bcrypt from 'bcryptjs';
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

          schema.pre('save', async function (next) {
            try {
              const SALT_ROUNDS = 10;
              const salt = await bcrypt.genSalt(SALT_ROUNDS);
              this.password = await bcrypt.hash(this.password, salt);

              return next();
            } catch (error) {
              return next(error);
            }
          });

          schema.methods.comparePasswords = async function (password: string) {
            try {
              const isValid = await bcrypt.compare(password, this.password);
              return isValid;
            } catch (error) {
              return false;
            }
          };

          return schema;
        },
      },
    ]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
