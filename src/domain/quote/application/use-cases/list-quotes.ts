import type { Quote } from "../../enterprise/entities/quote";
import type {
  QuoteFilters,
  QuoteRepository,
} from "../repositories/quote-repository";

interface ListQuotesRequest extends QuoteFilters {
  page?: number;
  perPage?: number;
  query?: string;
}

interface ListQuotesResponse {
  quotes: Quote[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
}

export class ListQuotesUseCase {
  constructor(private quoteRepository: QuoteRepository) {}
  async execute(request: ListQuotesRequest = {}): Promise<ListQuotesResponse> {
    const { page = 1, perPage = 10, query, ...filters } = request;
    const hasFilters = Object.keys(filters).length > 0;

    const result = query
      ? await this.quoteRepository.search(
          query,
          { page, perPage },
          hasFilters ? filters : undefined,
        )
      : await this.quoteRepository.findAll(
          { page, perPage },
          hasFilters ? filters : undefined,
        );

    return {
      quotes: result.data,
      total: result.total,
      page: result.page,
      perPage: result.perPage,
      totalPages: result.totalPages,
    };
  }
}
