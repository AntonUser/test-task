import { ApiProperty } from '@nestjs/swagger';

export class UserShortDto {
  @ApiProperty()
  nickname: string;

  @ApiProperty({ format: 'uuid' })
  uid: string;
}
