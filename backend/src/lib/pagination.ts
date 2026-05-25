export interface PaginationQuery {
  page: number;
  limit: number;
  skip: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export function parsePagination(query: Record<string, any>): PaginationQuery {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;
  return { page, limit, skip };
}

export function paginate<T>(
  data: T[],
  total: number,
  { page, limit }: PaginationQuery
): PaginatedResponse<T> {
  return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
}