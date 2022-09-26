import { ApiProperty } from '@nestjs/swagger';
import { MetaDto } from './meta.dto';
import { TagResponseDto } from './tag-create-response.dto';

export class QueryResponseDto {
  @ApiProperty({ type: TagResponseDto, isArray: true })
  data: TagResponseDto[];

  @ApiProperty({ type: MetaDto })
  meta: MetaDto;
}
