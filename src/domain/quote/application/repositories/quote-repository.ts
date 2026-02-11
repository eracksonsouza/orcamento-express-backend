import type { Quote } from "@/src/domain/quote/enterprise/entities/quote";
import type { QuoteStatus } from "@/src/domain/quote/enterprise/enums/quote-status";
import type {
  PaginationParams,
  PaginatedResult,
} from "@/src/domain/customer/application/repositories/customer-repository";

export interface QuoteFilters {
  customerId?: string;
  status?: QuoteStatus;
  startDate?: Date;
  endDate?: Date;
  query?: string;
  page?: number;
  perPage?: number;
}

export interface QuoteRepository {
  existsById(): unknown;
  findById(id: string): Promise<Quote | null>;
  findByCustomerId(customerId: string): Promise<Quote[]>;
  findByStatus(status: QuoteStatus): Promise<Quote[]>;
  findAll(
    params?: PaginationParams,
    filters?: QuoteFilters,
  ): Promise<PaginatedResult<Quote>>;
  findVersions(parentId: string): Promise<Quote[]>;
  search(
    query: string,
    params?: PaginationParams,
    filters?: QuoteFilters,
  ): Promise<PaginatedResult<Quote>>;
  save(quote: Quote): Promise<void>;

  delete(id: string): Promise<void>;
  exists(id: string): Promise<boolean>;
}
