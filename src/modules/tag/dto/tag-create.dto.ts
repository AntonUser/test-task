import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class TagCreateDto {
  @ApiProperty({ format: 'name' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiPropertyOptional({ default: 0 })
  @IsOptional()
  @IsNumber()
  sortOrder: number;
}
