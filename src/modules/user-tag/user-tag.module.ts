import { Module } from '@nestjs/common';
import { UserTagService } from './user-tag.service';
import { UserTagController } from './user-tag.controller';
import { UserTag } from './entities/user-tag.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tag } from '../tag/entities/tag.entity';

@Module({
  providers: [UserTagService],
  controllers: [UserTagController],
  imports: [TypeOrmModule.forFeature([UserTag, Tag])],
})
export class UserTagModule {}
