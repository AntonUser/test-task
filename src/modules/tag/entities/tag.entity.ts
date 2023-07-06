import { User } from 'src/modules/user/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { TagResponseDto } from '../dto/tag-create-response.dto';
import { TagDto } from '../dto/tag.dto';
import { QueryResponseDto } from '../dto/query-response.dto';
import { TagQuery } from '../queries/tag.query';

@Entity()
export class Tag {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 40, unique: true })
  name: string;

  @Column({ default: 0 })
  sortOrder: number;

  @ManyToOne(() => User, (user) => user.tags)
  user: User;

  toDto(): TagDto {
    return {
      id: this.id,
      name: this.name,
      sortOrder: this.sortOrder.toString(),
    };
  }

  toResponseDto(): TagResponseDto {
    return {
      id: this.id,
      creator: this.user.toShortDto(),
      name: this.name,
      sortOrder: this.sortOrder.toString(),
    };
  }

  async toQueryResponseDto(
    tags: Tag[],
    query: TagQuery,
    quantity: number,
  ): Promise<QueryResponseDto> {
    const tagDtos: TagResponseDto[] = await Promise.all(
      tags.map(async (v): Promise<TagResponseDto> => {
        return v.toResponseDto();
      }),
    );

    return {
      data: tagDtos,
      meta: {
        offset: +query.offset,
        length: +query.length,
        quantity,
      },
    };
  }
}
