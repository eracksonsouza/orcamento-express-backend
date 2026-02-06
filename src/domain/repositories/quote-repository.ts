import type { Quote } from "../entities/quote";
import type { QuoteStatus } from "../entities/enums/quote-status";
import type { PaginationParams, PaginatedResult } from "./customer-repository";

export interface QuoteFilters {
  customerId?: string;
  status?: QuoteStatus;
  startDate?: Date;
  endDate?: Date;
}

export interface QuoteRepository {
  findById(id: string): Promise<Quote | null>;
  findByCustomerId(customerId: string): Promise<Quote[]>;
  findByStatus(status: QuoteStatus): Promise<Quote[]>;
  findAll(
    params?: PaginationParams,
    filters?: QuoteFilters,
  ): Promise<PaginatedResult<Quote>>;
  findVersions(parentId: string): Promise<Quote[]>;
  save(quote: Quote): Promise<void>;
  delete(id: string): Promise<void>;
  exists(id: string): Promise<boolean>;
}
