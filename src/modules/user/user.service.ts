import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { SigninDto } from '../auth/dto/signin.dto';
import * as bcrypt from 'bcrypt';
import { UserDto } from './dto/user.dto';
import { UserTag } from '../user-tag/entities/user-tag.entity';
import { TagService } from '../tag/tag.service';
import { TagDto } from '../tag/dto/tag.dto';
import { UserPutDto } from './dto/user-put.dto';
import { UserPutResponseDto } from './dto/user-put-response.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(UserTag)
    private readonly userTagRepo: Repository<UserTag>,
    private readonly tagService: TagService,
  ) {}
  findOne(uid: string): Promise<User | undefined> {
    return this.userRepo.findOneBy({ uid });
  }

  async findOneOrFailWithTags(uid: string): Promise<UserDto> {
    const user = await this.userRepo.findOneByOrFail({ uid });
    const userTags: UserTag[] = await this.userTagRepo.find({
      where: { userId: uid },
    });

    const tags: TagDto[] = await Promise.all(
      userTags.map(async (v) => {
        const tag = await this.tagService.findOneOrFail(v.tagId);
        return {
          id: tag.id,
          name: tag.name,
          sortOrder: tag.sortOrder.toString(),
        };
      }),
    );

    return {
      email: user.email,
      nickname: user.nickname,
      tags,
    };
  }

  async findOneByEmail(email: string): Promise<User | undefined> {
    return this.userRepo.findOneBy({ email });
  }

  create(dto: SigninDto) {
    const user = this.userRepo.create(dto);
    user.password = bcrypt.hashSync(dto.password, 10);
    return this.userRepo.save(user);
  }

  async delete(uid: string) {
    await this.userRepo.delete(uid);
  }

  async updateUser(dto: UserPutDto, uid: string): Promise<UserPutResponseDto> {
    await this.userRepo.update(uid, { ...dto });
    const user = await this.userRepo.findOneByOrFail({ uid });
    return { email: user.email, nickname: user.nickname };
  }
}
