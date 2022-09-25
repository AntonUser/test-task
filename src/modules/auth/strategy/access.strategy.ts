import { Inject, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from 'src/modules/user/user.service';

export class AccessStrategy extends PassportStrategy(Strategy) {
  constructor(@Inject(UserService) private userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: any) {
    if (!(await this.userService.findOne(payload.sub))) {
      throw new UnauthorizedException();
    }
    return payload;
  }
}
