import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
@Injectable()
export class ViewGuard implements CanActivate {
  constructor(private readonly jwt: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    let req: Request = context.switchToHttp().getRequest();
    let token = req.headers.authorization?.split(' ')?.[1];
    if (!token) {
      return true;
    }
    try {
      let data = this.jwt.verify(token);
      req['user-id'] = data.id;
      req['user-role'] = data.role;
      return true;
    } catch (error) {
      console.log(error);

      throw new UnauthorizedException('token not valid');
    }
  }
}
