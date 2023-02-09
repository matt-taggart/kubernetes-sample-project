import { Controller, Post, Body, Delete, Req } from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';

@Controller('v1')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  registerUser(@Body() registerUserDto: RegisterUserDto) {
    return this.authService.registerUser(registerUserDto);
  }

  @Post('login')
  loginUser(@Body() loginUserDto: LoginUserDto) {
    return this.authService.loginUser(loginUserDto);
  }

  @Post('refresh-token')
  refreshToken(@Req() request: Request) {
    return this.authService.refreshToken(request.cookies['cc_auth']);
  }

  @Delete('logout')
  logoutUser(@Req() request: Request) {
    return this.authService.logoutUser(request.cookies['cc_auth']);
  }
}
