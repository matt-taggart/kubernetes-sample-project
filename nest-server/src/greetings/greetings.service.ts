import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { catchError, map, of } from 'rxjs';
import { DeleteGreetingDto } from './dto/delete-greeting.dto';
import { GetGreetingsDto } from './dto/get-greetings.dto';

@Injectable()
export class GreetingsService {
  constructor(
    @Inject('GREETINGS_MICROSERVICE') private readonly client: ClientProxy,
  ) {}

  createGreeting({ userId, prompt }) {
    return this.client
      .send({ cmd: 'create-greeting' }, { userId, prompt })
      .pipe(
        catchError((error) => {
          return of(error.response);
        }),
      );
  }

  getGreetings(getGreetingsDto: GetGreetingsDto) {
    return this.client.send({ cmd: 'get-greetings' }, getGreetingsDto).pipe(
      catchError((error) => {
        return of(error.response);
      }),
    );
  }

  removeGreeting(deleteGreetingDto: DeleteGreetingDto) {
    return this.client.send({ cmd: 'delete-greeting' }, deleteGreetingDto).pipe(
      catchError((error) => {
        return of(error.response);
      }),
    );
  }
}
