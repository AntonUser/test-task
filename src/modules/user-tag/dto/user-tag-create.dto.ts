import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class UserTagCreateDto {
  @ApiProperty({ example: [1, 2], type: 'number', isArray: true })
  @IsNumber({}, { each: true })
  @IsNotEmpty()
  tags: number[];
}
