import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsEmail, MinLength } from 'class-validator';
import { Password } from 'src/common/decorators/password.decorator';

export class LoginDto {
  @ApiProperty({ format: 'email' })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ minimum: 8 })
  @IsNotEmpty()
  @MinLength(8)
  @Password()
  password: string;
}
