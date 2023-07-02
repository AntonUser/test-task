import { Tag } from 'src/modules/tag/entities/tag.entity';
import {
  BeforeInsert,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import * as bcrypt from 'bcrypt';

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
}
