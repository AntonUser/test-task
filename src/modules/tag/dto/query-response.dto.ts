import { ApiProperty } from '@nestjs/swagger';
import { MetaDto } from './meta.dto';
import { TagCreateResponseDto } from './tag-create-response.dto';

export class QueryResponseDto {
  @ApiProperty({ type: TagCreateResponseDto, isArray: true })
  data: TagCreateResponseDto[];

  @ApiProperty({ type: MetaDto })
  meta: MetaDto;
}
