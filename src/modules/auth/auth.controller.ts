import { Body, Controller, Get, Post, Put, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Payload } from 'src/common/decorators/payload.decorator';
import { IPayload } from 'src/common/interfaces/payload.interface';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { SigninDto } from './dto/signin.dto';
import { TokenDto } from './dto/token.dto';
import { RefreshGuard } from './guards/refresh.guard';

@Controller()
@ApiTags('/auth')
export class AuthController {
  constructor(private readonly service: AuthService) {}

  @Post('signup')
  @ApiOkResponse({ type: TokenDto })
  signup(@Body() dto: SigninDto) {
    return this.service.signup(dto);
  }

  @Put('login')
  @ApiOkResponse({ type: TokenDto })
  login(@Body() dto: LoginDto) {
    return this.service.login(dto);
  }

  @Put('logout')
  @ApiBearerAuth('jwt')
  @UseGuards(AuthGuard('jwt'))
  logout(@Payload() payload: IPayload) {
    return this.service.logout(payload);
  }

  @Get('refresh')
  @UseGuards(RefreshGuard)
  refreshToken(@Payload() payload: IPayload) {
    return this.service.refresh(payload.sub);
  }
}
