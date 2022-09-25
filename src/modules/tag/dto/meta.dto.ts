import { ApiProperty } from '@nestjs/swagger';

export class MetaDto {
  @ApiProperty({ default: 0 })
  offset: number;

  @ApiProperty({ default: 10 })
  length: number;

  @ApiProperty()
  quantity: number;
}
