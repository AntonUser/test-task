import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { SigninDto } from '../auth/dto/signin.dto';
import { UserPutDto } from './dto/user-put.dto';
import { UserPutResponseDto } from './dto/user-put-response.dto';
import * as bcrypt from 'bcrypt';
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}
  findOne(uid: string): Promise<User | undefined> {
    return this.userRepo.findOne({ uid });
  }

  async findOneOrFailWithTags(uid: string) {
    const user = await this.userRepo.findOneOrFail(
      { uid },
      { relations: ['tags'] },
    );

    return {
      email: user.email,
      nickname: user.nickname,
      tags: user.tags,
    };
  }

  async findOneByEmail(email: string): Promise<User | undefined> {
    return this.userRepo.findOne({ email });
  }

  create(dto: SigninDto) {
    const user = this.userRepo.create(dto);
    return this.userRepo.save(user);
  }

  async updateUser(dto: UserPutDto, uid: string): Promise<UserPutResponseDto> {
    if (dto.password) {
      dto.password = bcrypt.hashSync(dto.password, 10);
    }
    await this.userRepo.update(uid, dto);
    const user = await this.userRepo.findOneOrFail({ uid });
    return { email: user.email, nickname: user.nickname };
  }

  async delete(uid: string) {
    await this.userRepo.delete(uid);
  }
}
