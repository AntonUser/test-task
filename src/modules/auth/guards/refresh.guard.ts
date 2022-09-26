import { AuthGuard } from '@nestjs/passport';
import { TokenExpiredError } from 'jsonwebtoken';

export class RefreshGuard extends AuthGuard('jwt') {
  handleRequest<TUser = any>(err: any, user: any, info: any): TUser {
    if (info instanceof TokenExpiredError) {
    }
    return user;
  }
}
