import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IPayload } from 'src/common/interfaces/payload.interface';
import { Repository } from 'typeorm';
import { UserTag } from '../user/entities/user-tag.entity';
import { User } from '../user/entities/user.entity';
import { QueryResponseDto } from './dto/query-response.dto';
import { TagCreateResponseDto } from './dto/tag-create-response.dto';
import { TagCreateDto } from './dto/tag-create.dto';
import { TagDto } from './dto/tag.dto';
import { Tag } from './entities/tag.entity';
import { TagQuery } from './queries/tag.query';

@Injectable()
export class TagService {
  constructor(
    @InjectRepository(Tag) private readonly tagRepo: Repository<Tag>,
    @InjectRepository(UserTag)
    private readonly userTagRepo: Repository<UserTag>,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) {}
  findOneOrFail(id: number) {
    return this.tagRepo.findOneByOrFail({ id });
  }

  async findOneOrFailWithCreator(id: number): Promise<TagCreateResponseDto> {
    const tag: Tag = await this.tagRepo.findOneByOrFail({ id });
    const user: User = await this.userRepo.findOneByOrFail({
      uid: tag.creator,
    });

    return {
      creator: {
        uid: user.uid,
        nickname: user.nickname,
      },
      name: tag.name,
      sortOrder: tag.sortOrder.toString(),
    };
  }

  async create(payload: IPayload, dto: TagCreateDto): Promise<TagDto> {
    const tag = await this.tagRepo.save(
      this.tagRepo.create({ ...dto, creator: payload.sub }),
    );
    return {
      id: tag.id,
      name: tag.name,
      sortOrder: tag.sortOrder.toString(),
    };
  }

  async findTags(query: TagQuery): Promise<QueryResponseDto> {
    const builder = this.tagRepo
      .createQueryBuilder('tag')
      .offset(+query.offset)
      .limit(+query.length);
    if (query.sortByName === '') {
      builder.orderBy('tag.name', 'ASC');
    }
    if (query.sortByOrder === '') {
      builder.addOrderBy('tag.sortOrder', 'ASC');
    }

    const tags = await builder.getMany();

    return {
      data: await Promise.all(
        tags.map(async (v): Promise<TagCreateResponseDto> => {
          const user: User = await this.userRepo.findOneBy({ uid: v.creator });
          return {
            creator: { uid: user.uid, nickname: user.nickname },
            name: v.name,
            sortOrder: v.sortOrder.toString(),
          };
        }),
      ),
      meta: {
        offset: +query.offset,
        length: +query.length,
        quantity: await builder.getCount(),
      },
    };
  }
}
