import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();

    const authHeader = request.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedException();
    }

    try {
      const accessToken = authHeader.split(' ')[1];

      const decoded = jwt.verify(
        accessToken.trim(),
        process.env.ACCESS_TOKEN_SECRET,
      );

      request.userId = (decoded as jwt.JwtPayload).id;

      return true;
    } catch (error) {
      throw new ForbiddenException();
    }
  }
}
