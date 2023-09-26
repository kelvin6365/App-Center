import { MetaDTO } from './meta.dto';

export class PageDTO<T> {
  readonly items: T[];

  readonly meta: MetaDTO;

  constructor(items: T[], meta: MetaDTO) {
    this.items = items;
    this.meta = meta;
  }
}
