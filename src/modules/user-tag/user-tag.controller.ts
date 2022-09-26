import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Payload } from 'src/common/decorators/payload.decorator';
import { IPayload } from 'src/common/interfaces/payload.interface';
import { UserTagCreateResponseDto } from './dto/user-tag-create-response.dto';
import { UserTagCreateDto } from './dto/user-tag-create.dto';
import { UserTagService } from './user-tag.service';

@Controller('user/tag')
@ApiTags('user/tag')
@UseGuards(AuthGuard('jwt'))
export class UserTagController {
  constructor(private readonly service: UserTagService) {}

  @Post()
  @ApiOkResponse({ type: UserTagCreateResponseDto, isArray: true })
  createUserTags(@Body() dto: UserTagCreateDto, @Payload() payload: IPayload) {
    return this.service.create(dto, payload);
  }

  @Delete('/:id')
  delete(@Param('id') id: number, @Payload() payload: IPayload) {
    return this.service.delete(id, payload);
  }

  @Get('/my')
  @ApiOkResponse({ type: UserTagCreateResponseDto, isArray: true })
  getMyTags(@Payload() payload: IPayload) {
    return this.service.getMyTags(payload);
  }
}
