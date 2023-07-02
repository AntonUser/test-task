import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { Password } from 'src/common/decorators/password.decorator';

export class SigninDto {
  @ApiProperty({ format: 'email' })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ minimum: 8 })
  @IsNotEmpty()
  @MinLength(8)
  @Password()
  password: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  nickname: string;
}
