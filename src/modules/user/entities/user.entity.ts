import { Tag } from 'src/modules/tag/entities/tag.entity';
import {
  BeforeInsert,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UserShortDto } from '../dto/user-short.dto';
import { UserPutResponseDto } from '../dto/user-put-response.dto';
import { UserDto } from '../dto/user.dto';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  uid: string;

  @Column({ length: 100, unique: true })
  email: string;

  @Column({ length: 100 })
  password: string;

  @Column({ length: 30, unique: true })
  nickname: string;

  @OneToMany(() => Tag, (tag) => tag.user)
  tags: Tag[];

  @BeforeInsert()
  async hashPasswordBeforeInsert() {
    this.password = bcrypt.hashSync(this.password, 10);
  }

  async toDto(): Promise<UserDto> {
    return {
      email: this.email,
      nickname: this.nickname,
      tags: await Promise.all(this.tags.map((v) => v.toDto())),
    };
  }

  toShortDto(): UserShortDto {
    return {
      uid: this.uid,
      nickname: this.nickname,
    };
  }

  toUserPutResponseDto(): UserPutResponseDto {
    return {
      email: this.email,
      nickname: this.nickname,
    };
  }
}
