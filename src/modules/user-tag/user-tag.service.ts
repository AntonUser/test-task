import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IPayload } from 'src/common/interfaces/payload.interface';
import { In, Repository } from 'typeorm';
import { Tag } from '../tag/entities/tag.entity';
import { UserTagCreateResponseDto } from './dto/user-tag-create-response.dto';
import { UserTagCreateDto } from './dto/user-tag-create.dto';
import { UserTag } from './entities/user-tag.entity';

@Injectable()
export class UserTagService {
  constructor(
    @InjectRepository(UserTag)
    private readonly userTagRepo: Repository<UserTag>,
    @InjectRepository(Tag)
    private readonly tagRepo: Repository<Tag>,
  ) {}

  async create(dto: UserTagCreateDto, payload: IPayload) {
    const tags: Tag[] = [];
    const userTags: UserTag[] = [];
    for (const id of dto.tags) {
      const tag: Tag = await this.tagRepo.findOneBy({ id });
      if (!tag) {
        return [];
      }
      tags.push(tag);
      if (
        !(await this.userTagRepo.findOne({
          where: { userId: payload.sub, tagId: id },
        }))
      ) {
        userTags.push(
          this.userTagRepo.create({ userId: payload.sub, tagId: id }),
        );
      }
    }
    await this.userTagRepo.save(userTags);

    return tags.map((v) => {
      return {
        id: v.id,
        name: v.name,
        sortOrder: v.sortOrder.toString(),
      };
    });
  }

  async delete(
    id: number,
    payload: IPayload,
  ): Promise<UserTagCreateResponseDto[]> {
    await this.userTagRepo.delete(id);
    const userTags = await this.userTagRepo.find({
      where: { userId: payload.sub },
    });
    const tagIds = userTags.map((v) => v.tagId);

    return (await this.tagRepo.find({ where: { id: In(tagIds) } })).map((v) => {
      return { id: v.id, name: v.name, sortOrder: v.sortOrder.toString() };
    });
  }

  async getMyTags(payload: IPayload): Promise<UserTagCreateResponseDto[]> {
    return (await this.tagRepo.find({ where: { creator: payload.sub } })).map(
      (v) => {
        return { id: v.id, name: v.name, sortOrder: v.sortOrder.toString() };
      },
    );
  }
}
