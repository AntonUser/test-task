import { ApiProperty } from '@nestjs/swagger';
import { UserShortDto } from 'src/modules/user/dto/user-short.dto';

export class TagCreateResponseDto {
  @ApiProperty({ type: UserShortDto })
  creator: UserShortDto;

  @ApiProperty()
  name: string;

  @ApiProperty()
  sortOrder: string;
}
