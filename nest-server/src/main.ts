import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import * as bodyParser from 'body-parser';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.use(cookieParser());
  app.use(
    bodyParser({
      detectJSON: function (ctx) {
        return /images\/webhook/i.test(ctx.path);
      },
    }),
  );
  app.useGlobalPipes(
    new ValidationPipe({ transform: true, validateCustomDecorators: true }),
  );
  await app.listen(8080);
}
bootstrap();
