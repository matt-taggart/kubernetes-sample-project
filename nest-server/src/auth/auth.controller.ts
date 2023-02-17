import {
  Controller,
  Post,
  Body,
  Delete,
  Req,
  Res,
  HttpCode,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login-user.dto';
import { RegisterGoogleUserDto } from './dto/register-google-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  registerUser(
    @Body() registerUserDto: RegisterUserDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    return this.authService.registerUser(registerUserDto, response);
  }

  @Post('register/google')
  registerGoogleUser(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const accessToken = request.headers.authorization.slice(7).trim();
    console.log('%caccesssToken', 'color:cyan; ', accessToken);
    return this.authService.registerGoogleUser({ accessToken }, response);
  }

  @Post('login')
  loginUser(
    @Body() loginUserDto: LoginUserDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    return this.authService.loginUser(loginUserDto, response);
  }

  @Post('refresh-token')
  refreshToken(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    return this.authService.refreshToken(
      { refreshToken: request.cookies['cc_auth'] },
      response,
    );
  }

  @Delete('logout')
  @HttpCode(204)
  logoutUser(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    return this.authService.logoutUser(
      { refreshToken: request.cookies['cc_auth'] },
      response,
    );
  }
}
