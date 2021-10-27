import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TagEntity } from 'src/entities/tag.entity';
import { UserModule } from 'src/user/user.module';
import { TagController } from './tag.controller';
import { TagService } from './tag.service';

@Module({
  imports: [TypeOrmModule.forFeature([TagEntity]), UserModule],
  controllers: [TagController],
  providers: [TagService]
})
export class TagModule {}
