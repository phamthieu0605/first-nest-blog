import {
  Entity,
  Column,
  BeforeInsert,
  OneToMany,
  BeforeUpdate,
} from 'typeorm';
import { IsEmail } from 'class-validator';
import * as bcrypt from 'bcrypt';
import { ArticleEntity } from './article.entity';
import { AbstractEntity } from './abstract.entity';
import { classToPlain, Exclude } from 'class-transformer';

@Entity('users')
export class UserEntity extends AbstractEntity {
  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  @IsEmail()
  email: string;

  @Column({ default: '' })
  image: string;

  @Column()
  @Exclude()
  password: string;

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }

  async comparePassword(attempt: string) {
    return await bcrypt.compare(attempt, this.password);
  }

  @OneToMany((type) => ArticleEntity, (article) => article.author)
  articles: ArticleEntity[];

  toJSON() {
    return classToPlain(this);
  }
}
