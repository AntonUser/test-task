import { ApiProperty } from '@nestjs/swagger';

export class UserTagCreateResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty({ example: '1' })
  sortOrder: string;
}
