import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import jwt from 'jsonwebtoken';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    console.log('%crequest', 'color:cyan; ', request);

    const authHeader = request.headers['Authorization'];
    if (!authHeader) {
      throw new UnauthorizedException();
    }

    try {
      const accessToken = authHeader.split(' ')[1];
      const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
      console.log('%cdecoded', 'color:cyan; ', decoded);
      // @ts-ignore
      request.state.userId = decoded.id;
    } catch (error) {
      throw new ForbiddenException();
    }

    return request;
  }
}
