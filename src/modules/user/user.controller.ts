import { Body, Controller, Delete, Get, Put, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Payload } from 'src/common/decorators/payload.decorator';
import { IPayload } from 'src/common/interfaces/payload.interface';
import { UserPutResponseDto } from './dto/user-put-response.dto';
import { UserPutDto } from './dto/user-put.dto';
import { UserDto } from './dto/user.dto';
import { UserService } from './user.service';

@Controller('user')
@ApiTags('/user')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
export class UserController {
  constructor(private readonly service: UserService) {}
  @Get()
  @ApiOkResponse({ type: UserDto })
  getMe(@Payload() payload: IPayload) {
    return this.service.findOneOrFailWithTags(payload.sub);
  }

  @Put()
  @ApiOkResponse({ type: UserPutResponseDto })
  updateMe(@Payload() payload: IPayload, @Body() dto: UserPutDto) {
    return this.service.updateUser(dto, payload.sub);
  }

  @Delete()
  @ApiOkResponse({ type: UserDto })
  delete(@Payload() payload: IPayload) {
    return this.service.delete(payload.sub);
  }
}
