import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { AppService } from './app.service';
import { LoginUserDto } from './dto/login-user.dto';
import { LogoutUserDto } from './dto/logout-user.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { RegisterUserDto } from './dto/register-user.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern({ cmd: 'register' })
  registerUser(registerUserDto: RegisterUserDto) {
    console.log('got to microservice');
    return this.appService.registerUser(registerUserDto);
  }

  @MessagePattern({ cmd: 'login' })
  loginUser(loginUserDto: LoginUserDto) {
    return this.appService.loginUser(loginUserDto);
  }

  @MessagePattern({ cmd: 'refresh' })
  refreshToken(refreshTokenDto: RefreshTokenDto) {
    return this.appService.refreshToken(refreshTokenDto);
  }

  @MessagePattern({ cmd: 'logout' })
  logoutUser(logoutTokenDto: LogoutUserDto) {
    return this.appService.logoutUser(logoutTokenDto);
  }
}
