import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, Matches } from 'class-validator';

export class UserPutDto {
  @ApiPropertyOptional({ format: 'email' })
  @IsOptional()
  @IsEmail()
  email: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Matches('(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}', undefined, {
    message:
      'password: Password must be 8 characters long, 1 lowercase and 1 uppercase character',
  })
  password: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  nickname: string;
}
