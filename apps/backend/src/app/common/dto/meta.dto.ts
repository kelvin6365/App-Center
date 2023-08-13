import { ApiProperty } from '@nestjs/swagger';
import { IPaginationMeta } from 'nestjs-typeorm-paginate';

export class MetaDTO implements IPaginationMeta {
  /**
   * the amount of items on this specific page
   */
  @ApiProperty()
  itemCount: number;
  /**
   * the total amount of items
   */
  @ApiProperty()
  totalItems?: number;
  /**
   * the amount of items that were requested per page
   */
  @ApiProperty()
  itemsPerPage: number;
  /**
   * the total amount of pages in this paginator
   */
  @ApiProperty()
  totalPages?: number;
  /**
   * the current page this paginator "points" to
   */
  @ApiProperty()
  currentPage: number;
}
