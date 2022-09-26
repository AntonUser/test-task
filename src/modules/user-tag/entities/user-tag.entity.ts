import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class UserTag {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('uuid')
  userId: string;

  @Column()
  tagId: number;
}
