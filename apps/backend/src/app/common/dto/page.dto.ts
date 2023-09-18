import { MetaDTO } from './meta.dto';

export class PageDto<T> {
  readonly items: T[];

  readonly meta: MetaDTO;

  constructor(items: T[], meta: MetaDTO) {
    this.items = items;
    this.meta = meta;
  }
}
