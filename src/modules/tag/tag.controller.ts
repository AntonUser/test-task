import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
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
import { TagResponseDto } from './dto/tag-create-response.dto';
import { TagCreateDto } from './dto/tag-create.dto';
import { TagUpdateDto } from './dto/tag-update.dto';
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
  @ApiOkResponse({ type: TagResponseDto })
  findById(@Param('id') id: number) {
    return this.service.findOneOrFailWithCreator(id);
  }

  @Get()
  @ApiOkResponse({ type: QueryResponseDto })
  find(@Query() qyery: TagQuery) {
    return this.service.findTags(qyery);
  }

  @Put('/:id')
  @ApiOkResponse({ type: QueryResponseDto })
  updateTag(
    @Payload() payload: IPayload,
    @Param('id') id: number,
    @Body() dto: TagUpdateDto,
  ) {
    return this.service.updateTag(id, payload, dto);
  }

  @Delete('/:id')
  deleteTags(@Payload() payload: IPayload, @Param('id') id: number) {
    return this.service.delete(id, payload);
  }
}
