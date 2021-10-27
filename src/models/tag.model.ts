import { ApiProperty } from '@nestjs/swagger';

export class TagDto {
  @ApiProperty()
  tag: string;
}
