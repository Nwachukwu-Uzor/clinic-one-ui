export type PaginatedResponseType<T> = {
  data: T[];
  pageSize: number;
  totalRecords: number;
  currentPage: number;
  totalPages: number;
};
