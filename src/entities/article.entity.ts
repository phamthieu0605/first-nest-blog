import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { AbstractEntity } from "./abstract.entity";
import { UserEntity } from "./user.entity";
import { CommentEntity } from "./comment.entity";
import { TagEntity } from "./tag.entity";

@Entity('articles')
export class ArticleEntity extends AbstractEntity {
  @Column()
  slug: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  content: string;

  @Column({ default: '' })
  file: string;

  @ManyToOne((type) => UserEntity, (user) => user.articles, { eager: true })
  @JoinColumn()
  author: UserEntity;

  @OneToMany((type) => CommentEntity, (comment) => comment.article, {
    eager: true,
  })
  @JoinColumn()
  comments: CommentEntity[];

  @OneToMany((type) => TagEntity, (tag) => tag.article, { eager: true })
  @JoinColumn()
  tags: TagEntity[];
}
