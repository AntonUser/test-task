import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumberString, IsOptional } from 'class-validator';

export class TagQuery {
  @ApiPropertyOptional({ default: '', type: 'string' })
  @IsOptional()
  sortByOrder = '0';

  @ApiPropertyOptional({ default: '', type: 'string' })
  @IsOptional()
  sortByName = '0';

  @ApiPropertyOptional({ default: '0', type: 'string' })
  @IsOptional()
  @IsNumberString()
  offset = '0';

  @ApiPropertyOptional({ default: '10', type: 'string' })
  @IsOptional()
  @IsNumberString()
  length = '10';
}
