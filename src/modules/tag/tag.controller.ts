import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiExtraModels,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Payload } from 'src/common/decorators/payload.decorator';
import { IPayload } from 'src/common/interfaces/payload.interface';
import { QueryResponseDto } from './dto/query-response.dto';
import { TagCreateResponseDto } from './dto/tag-create-response.dto';
import { TagCreateDto } from './dto/tag-create.dto';
import { TagDto } from './dto/tag.dto';
import { TagQuery } from './queries/tag.query';
import { TagService } from './tag.service';

@Controller('tag')
@ApiTags('/tag')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@ApiExtraModels(TagQuery)
export class TagController {
  constructor(private readonly service: TagService) {}
  @Post()
  @ApiOkResponse({ type: TagDto })
  createTag(@Payload() payload: IPayload, @Body() dto: TagCreateDto) {
    return this.service.create(payload, dto);
  }

  @Get('/:id')
  @ApiOkResponse({ type: TagCreateResponseDto })
  findById(@Param('id') id: number) {
    return this.service.findOneOrFailWithCreator(id);
  }

  @Get()
  @ApiOkResponse({ type: QueryResponseDto })
  find(@Query() qyery: TagQuery) {
    return this.service.findTags(qyery);
  }
}
