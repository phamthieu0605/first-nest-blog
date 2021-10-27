import { Body, Controller, Delete, Get, Param, Post, Put, Query, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { User } from 'src/auth/user.decorator';
import { multerOptions } from 'src/config/multer.config';
import { ArticleEntity } from 'src/entities/article.entity';
import { CommentEntity } from 'src/entities/comment.entity';
import { UserEntity } from 'src/entities/user.entity';
import { CreateArticleDto, CreateCommentDto, UpdateArticleDto } from 'src/models/article.model';
import { ArticleService } from './article.service';

@ApiBearerAuth('JWT-token')
@ApiTags('Article')
@Controller('articles')
export class ArticleController {
  constructor(private articleService: ArticleService) {}

  @Get()
  @ApiOperation({ summary: 'Get all articles' })
  @ApiResponse({ status: 200, description: 'Return all articles.' })
  async findAll(@Query() query) {
    return await this.articleService.getAllArticles(query);
  }

  @Get('/:id')
  @ApiOperation({ summary: 'Get an article' })
  @ApiResponse({ status: 200, description: 'Return an article.' })
  async findById(@Param('id') id: number) {
    return await this.articleService.getArticle({ id });
  }

  @Post()
  @UseGuards(AuthGuard())
  @UseInterceptors(FileInterceptor('file', multerOptions))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Create an article' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string' },
        description: { type: 'string' },
        content: { type: 'string' },
        tagList: { type: 'array' },
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
    description: 'Create post',
  })
  async createArticle(
    @User() user: UserEntity,
    @Body() articleData: CreateArticleDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return await this.articleService.createArticle(user, articleData, file);
  }

  @Put('/:slug')
  @UseGuards(AuthGuard())
  async updateArticle(
    @User() user: UserEntity,
    @Param('slug') slug,
    @Body() articleData: UpdateArticleDto,
  ) {
    return await this.articleService.updateArticle(user, slug, articleData);
  }

  @Delete('/:slug')
  @UseGuards(AuthGuard())
  async deleteArticle(@Param() params) {
    return this.articleService.deleteArticle(params.slug);
  }

  @Post('/:slug/comments')
  async createComment(
    @Param('slug') slug,
    @Body() commentData: CreateCommentDto,
  ) {
    return await this.articleService.addComment(slug, commentData);
  }

  // Find all comments of a article
  @Get(':slug/comments')
  async findComments(@Param('slug') slug: string) {
    return await this.articleService.findComments(slug);
  }

  @Delete(':slug/comments/:id')
  async deleteComment(@Param('slug') slug: string, @Param('id') id: number) {
    return await this.articleService.deleteComment(slug, id);
  }
}
