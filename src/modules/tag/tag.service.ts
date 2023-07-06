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

    return tag.toResponseDto();
  }

  async create(payload: IPayload, dto: TagCreateDto): Promise<TagDto> {
    const user = await this.userRepo.findOne(payload.sub);
    const tag = await this.tagRepo.save(this.tagRepo.create({ ...dto, user }));
    return tag.toDto();
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

    return new Tag().toQueryResponseDto(tags, query, await builder.getCount());
  }

  async updateTag(
    id: number,
    payload: IPayload,
    dto: TagUpdateDto,
  ): Promise<TagResponseDto> {
    let tag: Tag = await this.tagRepo.findOneOrFail(
      { id },
      { relations: ['user'] },
    );

    if (tag.user.uid !== payload.sub) {
      throw new ForbiddenException(`The tag does not belong to you`);
    }

    await this.tagRepo.update(tag.id, { ...tag, ...dto });

    tag = await this.tagRepo.findOneOrFail({ id }, { relations: ['user'] });
    return tag.toResponseDto();
  }

  async delete(id: number, payload: IPayload): Promise<void> {
    const tag = await this.tagRepo.findOneOrFail(
      { id },
      { relations: ['user'] },
    );

    if (tag.user.uid !== payload.sub) {
      throw new ForbiddenException();
    }

    await this.tagRepo.delete(id);
  }
}
