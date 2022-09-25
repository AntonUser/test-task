import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Tag {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('uuid')
  creator: string;

  @Column({ length: 40, unique: true })
  name: string;

  @Column({ default: 0 })
  sortOrder: number;
}
