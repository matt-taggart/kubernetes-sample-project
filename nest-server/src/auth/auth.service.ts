import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { LoginUserDto } from './dto/login-user.dto';
import { LogoutUserDto } from './dto/logout-user.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { RegisterUserDto } from './dto/register-user.dto';

@Injectable()
export class AuthService {
  constructor(
    @Inject('AUTH_MICROSERVICE') private readonly client: ClientProxy,
  ) {}

  registerUser(registerUserDto: RegisterUserDto) {
    return this.client.send({ cmd: 'register' }, registerUserDto);
  }

  loginUser(loginUserDto: LoginUserDto) {
    return this.client.send({ cmd: 'login' }, loginUserDto);
  }

  refreshToken(refreshTokenDto: RefreshTokenDto) {
    return this.client.send({ cmd: 'refresh' }, refreshTokenDto);
  }

  logoutUser(logoutUserDto: LogoutUserDto) {
    return this.client.send({ cmd: 'logout' }, logoutUserDto);
  }
}
