import { Column, Entity, ManyToOne } from 'typeorm';
import { AbstractEntity } from './abstract.entity';
import { ArticleEntity } from './article.entity';

@Entity('tags')
export class TagEntity extends AbstractEntity {
  @Column('simple-array')
  tagList: string[];

  @ManyToOne(() => ArticleEntity, (article) => article.tags, {
    onDelete: 'CASCADE',
  })
  article: ArticleEntity;
}
