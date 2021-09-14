export interface PaginationContext {
  currentLimit: number;
  total: number;
  currentOffset: number;
  nextOffset: number;
  currentPage: number;
}

export interface PaginateOptions {
  backoff?: number;
  maxItems?: number;
  maxRequests?: number;
}
