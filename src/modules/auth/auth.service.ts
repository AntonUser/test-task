import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { TokenDto } from './dto/token.dto';
import { SigninDto } from './dto/signin.dto';
import * as timestring from 'timestring';
import { UserService } from '../user/user.service';
import { User } from '../user/entities/user.entity';
import { IPayload } from 'src/common/interfaces/payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private readonly userService: UserService,
  ) {}
  private async getToken(userId: string): Promise<TokenDto> {
    const at = await this.jwtService.signAsync(
      {
        sub: userId,
      },
      {
        secret: process.env.JWT_SECRET,
        expiresIn: process.env.JWT_EXP || '30m',
      },
    );
    const token = new TokenDto();
    token.token = at;
    token.expire = timestring(process.env.JWT_EXP || '30m');

    return token;
  }

  async login(dto: LoginDto): Promise<TokenDto> {
    const { email, password } = dto;
    const user: User = await this.userService.findOneByEmail(email);
    if (!user) {
      throw new NotFoundException('Email not found');
    }

    if (!(await bcrypt.compare(password, user.password))) {
      throw new BadRequestException('Incorrect password');
    }
    return this.getToken(user.uid);
  }

  async signup(dto: SigninDto): Promise<TokenDto> {
    const { email } = dto;
    if (await this.userService.findOneByEmail(email)) {
      throw new BadRequestException(
        'User with this email address already exists',
      );
    }
    await this.userService.create(dto);
    return this.login(dto);
  }

  async logout(payload: IPayload): Promise<void> {
    const { sub } = payload;
    await this.userService.delete(sub);
  }

  async refresh(userId: string): Promise<TokenDto> {
    if (!(await this.userService.findOne(userId))) {
      throw new ForbiddenException();
    }
    return this.getToken(userId);
  }
}
