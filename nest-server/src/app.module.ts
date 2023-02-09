import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { CustomersModule } from './customers/customers.module';
import { ImagesModule } from './images/images.module';
import { GreetingsModule } from './greetings/greetings.module';

@Module({
  imports: [AuthModule, CustomersModule, ImagesModule, GreetingsModule],
})
export class AppModule {}
