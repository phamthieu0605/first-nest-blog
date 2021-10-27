import { ApiExtraModels, ApiProperty } from '@nestjs/swagger';

export class CreateCommentDto {
  @ApiProperty()
  body: string;
}

export class CreateArticleDto {
  @ApiProperty({
    type: String,
  })
  title: string;

  @ApiProperty({
    type: String,
  })
  description: string;

  @ApiProperty({
    type: String,
  })
  content: string;

  @ApiProperty({
    type: [String],
  })
  tagList: string[];

  @ApiProperty({
    type: [String],
  })
  file: any;
}

export class UpdateArticleDto extends CreateArticleDto {}
