import { ApiProperty } from '@nestjs/swagger';

export class UserPutResponseDto {
  @ApiProperty({ format: 'email' })
  email: string;

  @ApiProperty()
  nickname: string;
}
