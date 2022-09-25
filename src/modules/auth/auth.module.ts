import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { AccessStrategy } from './strategy/access.strategy';
import { UserModule } from '../user/user.module';

@Module({
  controllers: [AuthController],
  providers: [AuthService, AccessStrategy],
  imports: [UserModule, JwtModule.register({})],
})
export class AuthModule {}
