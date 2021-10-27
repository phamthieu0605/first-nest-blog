import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ArticleEntity } from 'src/entities/article.entity';
import { CommentEntity } from 'src/entities/comment.entity';
import { UserEntity } from 'src/entities/user.entity';
import { CreateArticleDto, UpdateArticleDto } from 'src/models/article.model';
import { getRepository, Repository } from 'typeorm';
import slugify from 'slugify';
import { TagEntity } from 'src/entities/tag.entity';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(ArticleEntity)
    private articleRepo: Repository<ArticleEntity>,
    @InjectRepository(CommentEntity)
    private commentRepo: Repository<CommentEntity>,
    @InjectRepository(UserEntity)
    private userRepo: Repository<UserEntity>,
    @InjectRepository(TagEntity)
    private tagRepo: Repository<TagEntity>,
  ) {}

  async getAllArticles(query) {
    const qb = await getRepository(ArticleEntity)
      .createQueryBuilder('article')
      .leftJoinAndSelect('article.author', 'author');

    qb.where('1 = 1');

    if ('tag' in query) {
      qb.andWhere('article.tagList LIKE :tag', { tag: `%${query.tag}%` });
    }

    if ('author' in query) {
      const author = await this.userRepo.findOne({
        username: query.author,
      });
      qb.andWhere('article.authorId = :id', { id: author.id });
    }

    if ('order-by' in query) {
      qb.orderBy('article.createdAt', query['order-by']);
    }

    if ('limit' in query) {
      qb.limit(query.limit);
    }

    if ('offset' in query) {
      qb.offset(query.offset);
    }

    const articles = await qb.getMany();

    return { articles };
  }

  async getArticle(where) {
    const article = await this.articleRepo.findOne(where);
    return { article };
  }

  async addComment(slug: string, commentData) {
    let article = await this.articleRepo.findOne({ slug });

    const comment = new CommentEntity();
    comment.body = commentData.body;

    article.comments.push(comment);

    await this.commentRepo.save(comment);
    article = await this.articleRepo.save(article);
    return { article };
  }

  async deleteComment(slug: string, id: number) {
    let article = await this.articleRepo.findOne({ slug });

    const comment = await this.commentRepo.findOne(id);
    const deleteIndex = article.comments.findIndex(
      (_comment) => _comment.id === comment.id,
    );

    if (deleteIndex >= 0) {
      const deleteComments = article.comments.splice(deleteIndex, 1);
      await this.commentRepo.delete(deleteComments[0].id);
      article = await this.articleRepo.save(article);
      return { article };
    } else {
      return { article };
    }
  }

  async findComments(slug: string) {
    const article = await this.articleRepo.findOne({ slug });
    return { comments: article.comments };
  }

  async createArticle(
    user: UserEntity,
    articleData: CreateArticleDto,
    file
  ) {
    let article = new ArticleEntity();
    article.title = articleData.title;
    article.description = articleData.description;
    article.slug = this.slugify(articleData.title);
    article.content = articleData.content;
    article.author = user;
    article.file = file.path;

    const newArticle = await this.articleRepo.save(article);

    let tag = new TagEntity();
    tag.tagList = articleData.tagList;
    tag.article = newArticle;

    const tags = await this.tagRepo.save(tag);

    return {newArticle, tags: tags.tagList};
  }

  async updateArticle(
    user: UserEntity,
    slug: string,
    articleData: UpdateArticleDto
  ) {
    try {
      let findOneArticle = await this.articleRepo.findOne({ slug });
      if (findOneArticle !== undefined && findOneArticle.author.id === user.id) {
        let article = new ArticleEntity();
        article.title = articleData.title;
        article.description = articleData.description;
        article.slug = this.slugify(articleData.title);
        article.content = articleData.content;

        let updated = Object.assign(findOneArticle, article);
        const updateArticle = await this.articleRepo.save(updated);

        return { updateArticle };
      }
      throw new UnauthorizedException();
    } catch (err) {
      throw new BadRequestException();
    }
  }

  async deleteArticle(slug: string) {
    return await this.articleRepo.delete({ slug: slug });
  }

  slugify(title: string) {
    return (
      slugify(title, { lower: true }) +
      '-' +
      ((Math.random() * Math.pow(36, 6)) | 0).toString(36)
    );
  }
}
