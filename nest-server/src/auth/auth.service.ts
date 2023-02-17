import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Response } from 'express';
import { catchError, map, of } from 'rxjs';
import { LoginUserDto } from './dto/login-user.dto';
import { LogoutUserDto } from './dto/logout-user.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { RegisterGoogleUserDto } from './dto/register-google-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { setRefreshTokenCookie } from './utils/cookie.utils';

@Injectable()
export class AuthService {
  constructor(
    @Inject('AUTH_MICROSERVICE') private readonly client: ClientProxy,
  ) {}

  registerUser(registerUserDto: RegisterUserDto, response: Response) {
    return this.client.send({ cmd: 'register' }, registerUserDto).pipe(
      map((data) => {
        setRefreshTokenCookie(response, data.refreshToken);

        return data;
      }),
      catchError((error) => {
        return of(error.response);
      }),
    );
  }

  registerGoogleUser(
    registerGoogleUserDto: RegisterGoogleUserDto,
    response: Response,
  ) {
    return this.client
      .send({ cmd: 'register-google' }, registerGoogleUserDto)
      .pipe(
        map((data) => {
          setRefreshTokenCookie(response, data.refreshToken);

          return data;
        }),
        catchError((error) => {
          return of(error.response);
        }),
      );
  }

  loginUser(loginUserDto: LoginUserDto, response: Response) {
    return this.client.send({ cmd: 'login' }, loginUserDto).pipe(
      map((data) => {
        setRefreshTokenCookie(response, data.refreshToken);

        return data;
      }),
      catchError((error) => {
        return of(error.response);
      }),
    );
  }

  refreshToken(refreshTokenDto: RefreshTokenDto, response: Response) {
    return this.client.send({ cmd: 'refresh' }, refreshTokenDto).pipe(
      map((data) => {
        setRefreshTokenCookie(response, data.refreshToken);

        return data;
      }),
      catchError((error) => {
        return of(error.response);
      }),
    );
  }

  logoutUser(logoutUserDto: LogoutUserDto, response: Response) {
    return this.client.send({ cmd: 'logout' }, logoutUserDto).pipe(
      map((data) => {
        response.clearCookie('cc_auth');

        return data;
      }),
      catchError((error) => {
        return of(error.response);
      }),
    );
  }
}
