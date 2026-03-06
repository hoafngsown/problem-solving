export interface PaginationQuery {
  page?: number;
  limit?: number;
  sort?: string;
  order?: "ASC" | "DESC";
}

export interface ItemFilters extends PaginationQuery {
  name?: string;
  status?: string;
  minPrice?: number;
  maxPrice?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface CreateItemDto {
  name: string;
  description?: string;
  price: number;
  status?: string;
}

export interface UpdateItemDto {
  name?: string;
  description?: string;
  price?: number;
  status?: string;
}
