import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Payload } from 'src/common/decorators/payload.decorator';
import { IPayload } from 'src/common/interfaces/payload.interface';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { SigninDto } from './dto/signin.dto';
import { TokenDto } from './dto/token.dto';

@Controller()
@ApiTags('/auth')
export class AuthController {
  constructor(private readonly service: AuthService) {}

  @Post('signin')
  @ApiOkResponse({ type: TokenDto })
  signin(@Body() dto: SigninDto) {
    return this.service.signin(dto);
  }

  @Post('login')
  @ApiOkResponse({ type: TokenDto })
  login(@Body() dto: LoginDto) {
    return this.service.login(dto);
  }

  @Post('logout')
  @ApiBearerAuth('jwt')
  @UseGuards(AuthGuard('jwt'))
  logout(@Payload() payload: IPayload) {
    return this.service.logout(payload);
  }
}
