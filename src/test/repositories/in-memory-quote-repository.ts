import type { Quote } from "@/src/domain/quote/enterprise/entities/quote";
import type {
  QuoteFilters,
  QuoteRepository,
} from "@/src/domain/quote/application/repositories/quote-repository";
import type { QuoteStatus } from "@/src/domain/quote/enterprise/enums/quote-status";
import type {
  PaginationParams,
  PaginatedResult,
} from "@/src/domain/customer/application/repositories/customer-repository";
import { paginate } from "./helpers/paginate";

export class InMemoryQuoteRepository implements QuoteRepository {
  public items: Quote[] = [];

  async save(quote: Quote): Promise<void> {
    const index = this.items.findIndex(
      (item) => item.id.toString() === quote.id.toString(),
    );

    if (index >= 0) {
      this.items[index] = quote;
      return;
    }

    this.items.push(quote);
  }

  async update(quote: Quote): Promise<void> {
    const index = this.items.findIndex(
      (item) => item.id.toString() === quote.id.toString(),
    );

    if (index < 0) {
      throw new Error("Quote not found");
    }

    this.items[index] = quote;
  }

  async findById(id: string): Promise<Quote | null> {
    return this.items.find((quote) => quote.id.toString() === id) ?? null;
  }

  async findByCustomerId(customerId: string): Promise<Quote[]> {
    return this.items.filter((quote) => quote.customerId === customerId);
  }

  async findByStatus(status: QuoteStatus): Promise<Quote[]> {
    return this.items.filter((quote) => quote.status === status);
  }

  async findAll(
    params?: PaginationParams,
    filters?: QuoteFilters,
  ): Promise<PaginatedResult<Quote>> {
    const filteredItems = this.applyFilters(this.items, filters);

    return paginate({ items: filteredItems, ...(params && { params }) });
  }

  async search(
    query: string,
    params?: PaginationParams,
    filters?: QuoteFilters,
  ): Promise<PaginatedResult<Quote>> {
    const normalizedQuery = query.trim().toLowerCase();
    const filteredItems = this.applyFilters(this.items, filters).filter(
      (quote) =>
        quote.id.toString().toLowerCase().includes(normalizedQuery) ||
        quote.customerId.toLowerCase().includes(normalizedQuery) ||
        quote.status.toLowerCase().includes(normalizedQuery) ||
        (quote.description?.toLowerCase().includes(normalizedQuery) ?? false),
    );

    return paginate({ items: filteredItems, ...(params && { params }) });
  }

  async findVersions(parentId: string): Promise<Quote[]> {
    return this.items.filter((quote) => quote.id.toString() === parentId);
  }

  async delete(id: string): Promise<void> {
    this.items = this.items.filter((quote) => quote.id.toString() !== id);
  }

  async exists(id: string): Promise<boolean> {
    return this.items.some((quote) => quote.id.toString() === id);
  }

  private applyFilters(items: Quote[], filters?: QuoteFilters): Quote[] {
    return items.filter((quote) => {
      if (filters?.customerId && quote.customerId !== filters.customerId) {
        return false;
      }

      if (filters?.status && quote.status !== filters.status) {
        return false;
      }

      if (filters?.startDate && quote.createdAt < filters.startDate) {
        return false;
      }

      if (filters?.endDate && quote.createdAt > filters.endDate) {
        return false;
      }

      return true;
    });
  }
}
