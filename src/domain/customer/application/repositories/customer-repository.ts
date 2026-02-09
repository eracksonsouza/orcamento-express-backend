import type { Customer } from "@/src/domain/customer/enterprise/entities/customer";

export interface PaginationParams {
  page: number;
  perPage: number;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
}

export interface CustomerRepository {
  findById(id: string): Promise<Customer | null>;
  findByEmail(email: string): Promise<Customer | null>;
  findByPhone(phone: string): Promise<Customer | null>;
  findAll(params?: PaginationParams): Promise<PaginatedResult<Customer>>;
  search(
    query: string,
    params?: PaginationParams,
  ): Promise<PaginatedResult<Customer>>;
  save(customer: Customer): Promise<void>;
  delete(id: string): Promise<void>;
  exists(id: string): Promise<boolean>;
}
