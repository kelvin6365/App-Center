import { ApiProperty } from '@nestjs/swagger';
import { IsArray } from 'class-validator';
import { MetaDTO } from './meta.dto';

export class PageDto<T> {
  @IsArray()
  @ApiProperty({ isArray: true })
  readonly items: T[];

  @ApiProperty({ type: () => MetaDTO })
  readonly meta: MetaDTO;

  constructor(items: T[], meta: MetaDTO) {
    this.items = items;
    this.meta = meta;
  }
}
