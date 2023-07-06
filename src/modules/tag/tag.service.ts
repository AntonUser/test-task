import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IPayload } from 'src/common/interfaces/payload.interface';
import { Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { QueryResponseDto } from './dto/query-response.dto';
import { TagResponseDto } from './dto/tag-create-response.dto';
import { TagCreateDto } from './dto/tag-create.dto';
import { TagUpdateDto } from './dto/tag-update.dto';
import { TagDto } from './dto/tag.dto';
import { Tag } from './entities/tag.entity';
import { TagQuery } from './queries/tag.query';

@Injectable()
export class TagService {
  constructor(
    @InjectRepository(Tag) private readonly tagRepo: Repository<Tag>,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) {}
  findOneOrFail(id: number) {
    return this.tagRepo.findOneOrFail({ id });
  }

  async findOneOrFailWithCreator(
    id: number,
    payload: IPayload,
  ): Promise<TagResponseDto> {
    const user = await this.userRepo.findOneOrFail(payload.sub);
    const tag: Tag = await this.tagRepo.findOneOrFail({
      id,
      user,
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
    const user = await this.userRepo.findOne(payload.sub);
    const tag = await this.tagRepo.save(this.tagRepo.create({ ...dto, user }));
    return {
      id: tag.id,
      name: tag.name,
      sortOrder: tag.sortOrder.toString(),
    };
  }

  async findTags(
    query: TagQuery,
    payload: IPayload,
  ): Promise<QueryResponseDto> {
    const builder = this.tagRepo
      .createQueryBuilder('tag')
      .leftJoinAndSelect('tag.user', 'user')
      .where('user.uid = :uid', { uid: payload.sub })
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
        tags.map(async (v): Promise<TagResponseDto> => {
          return {
            creator: { uid: v.user.uid, nickname: v.user.nickname },
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

  async updateTag(
    id: number,
    payload: IPayload,
    dto: TagUpdateDto,
  ): Promise<TagResponseDto> {
    let tag = await this.tagRepo.findOneOrFail({ id }, { relations: ['user'] });
    if (tag.user.uid !== payload.sub) {
      throw new ForbiddenException(`The tag does not belong to you`);
    }
    tag = await this.tagRepo.save({ ...tag, ...dto });

    return {
      creator: {
        uid: tag.user.uid,
        nickname: tag.user.nickname,
      },
      name: tag.name,
      sortOrder: tag.sortOrder.toString(),
    };
  }

  async delete(id: number, payload: IPayload) {
    const tag = await this.tagRepo.findOneOrFail({ id });
    if (tag.name /*crator */ !== payload.sub) {
      throw new ForbiddenException();
    }

    await this.tagRepo.delete(id);
  }
}
