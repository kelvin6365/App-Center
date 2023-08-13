export class SearchQueryDTO {
  query: string;
  filters?: [{ key: string; values: string | boolean | any[] | number[] }];
  sorts?: [{ key: string; value: 'ASC' | 'DESC' }];
  withDeleted?: boolean;
}
