export type PaginatedResource<T> = {
  total: number;
  data: T[];
  page: number;
  size: number;
  last: number;
};
