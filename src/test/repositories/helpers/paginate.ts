import type {
  PaginatedResult,
  PaginationParams,
} from "@/src/domain/customer/application/repositories/customer-repository";

interface PaginateInput<T> {
  items: T[];
  params?: PaginationParams;
}

export function paginate<T>({
  items,
  params,
}: PaginateInput<T>): PaginatedResult<T> {
  const page = params?.page ?? 1;
  const perPage = params?.perPage ?? 10;
  const start = (page - 1) * perPage;
  const end = start + perPage;

  const data = items.slice(start, end);
  const total = items.length;

  return {
    data,
    total,
    page,
    perPage,
    totalPages: Math.ceil(total / perPage),
  };
}
