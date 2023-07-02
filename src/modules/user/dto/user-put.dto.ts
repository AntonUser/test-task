import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString } from 'class-validator';
import { Password } from 'src/common/decorators/password.decorator';

export class UserPutDto {
  @ApiPropertyOptional({ format: 'email' })
  @IsOptional()
  @IsEmail()
  email: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Password()
  password: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  nickname: string;
}
