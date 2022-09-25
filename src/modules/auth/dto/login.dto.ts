import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsEmail, MinLength, Matches } from 'class-validator';

export class LoginDto {
  @ApiProperty({ format: 'email' })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ minimum: 8 })
  @IsNotEmpty()
  @MinLength(8)
  @Matches('(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}', undefined, {
    message:
      'password: Password must be 8 characters long, 1 lowercase and 1 uppercase character',
  })
  password: string;
}
