import { ApiProperty } from '@nestjs/swagger';
import { TagDto } from 'src/modules/tag/dto/tag.dto';

export class UserDto {
  @ApiProperty({ format: 'email' })
  email: string;

  @ApiProperty()
  nickname: string;

  @ApiProperty({ type: TagDto, isArray: true })
  tags: TagDto[];
}
