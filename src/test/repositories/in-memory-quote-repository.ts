import { Quote } from "@/src/domain/entities/quote";
import type { QuoteStatus } from "@/src/domain/entities/enums/quote-status";
import type {
  PaginationParams,
  PaginatedResult,
} from "@/src/domain/repositories/customer-repository";
import type {
  QuoteRepository,
  QuoteFilters,
} from "@/src/domain/repositories/quote-repository";

export class InMemoryQuoteRepository implements QuoteRepository {
  public quotes: Quote[] = [];
  private parentIdMap: Map<string, string> = new Map(); // quoteId -> parentId

  async save(
    quote: Quote,
    _customerId?: string,
    parentId?: string,
  ): Promise<void> {
    const index = this.quotes.findIndex(
      (q) => q.id.toString() === quote.id.toString(),
    );
    if (index >= 0) {
      this.quotes[index] = quote;
    } else {
      this.quotes.push(quote);
    }

    // Store parentId separately if provided
    if (parentId) {
      this.parentIdMap.set(quote.id.toString(), parentId);
    }
  }

  async exists(id: string): Promise<boolean> {
    return this.quotes.some((q) => q.id.toString() === id);
  }

  async findById(id: string): Promise<Quote | null> {
    const quote = this.quotes.find((q) => q.id.toString() === id);
    return quote ?? null;
  }

  async findByCustomerId(customerId: string): Promise<Quote[]> {
    return this.quotes.filter((q) => q.customerId === customerId);
  }

  async findByStatus(status: QuoteStatus): Promise<Quote[]> {
    return this.quotes.filter((q) => q.status === status);
  }

  async findAll(
    params?: PaginationParams,
    filters?: QuoteFilters,
  ): Promise<PaginatedResult<Quote>> {
    const page = params?.page ?? 1;
    const perPage = params?.perPage ?? 10;

    let filtered = [...this.quotes];

    if (filters) {
      if (filters.customerId) {
        filtered = filtered.filter((q) => q.customerId === filters.customerId);
      }
      if (filters.status) {
        filtered = filtered.filter((q) => q.status === filters.status);
      }
      if (filters.startDate) {
        filtered = filtered.filter((q) => q.createdAt >= filters.startDate!);
      }
      if (filters.endDate) {
        filtered = filtered.filter((q) => q.createdAt <= filters.endDate!);
      }
    }

    const start = (page - 1) * perPage;
    const end = start + perPage;
    const data = filtered.slice(start, end);
    const total = filtered.length;

    return {
      data,
      total,
      page,
      perPage,
      totalPages: Math.ceil(total / perPage),
    };
  }

  async findVersions(parentId: string): Promise<Quote[]> {
    return this.quotes.filter((q) => {
      const storedParentId = this.parentIdMap.get(q.id.toString());
      return storedParentId === parentId;
    });
  }

  async delete(id: string): Promise<void> {
    const index = this.quotes.findIndex((q) => q.id.toString() === id);
    if (index >= 0) {
      this.quotes.splice(index, 1);
      this.parentIdMap.delete(id);
    }
  }

  // Helper methods for testing
  clear(): void {
    this.quotes = [];
    this.parentIdMap.clear();
  }
}
