import { Controller, Get } from '@nestjs/common';
import { TagService } from './tag.service';

@Controller('tags')
export class TagController {
  constructor(private tagsService: TagService) {}

  @Get()
  async getAllTags() {
    return this.tagsService.findAll();
  }
}
