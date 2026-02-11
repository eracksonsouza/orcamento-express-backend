import type { Quote } from "../../enterprise/entities/quote";
import type { QuoteRepository } from "../repositories/quote-repository";

interface ListQuotesRequest {
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
  async execute({
    page = 1,
    perPage = 10,
    query,
  }: ListQuotesRequest = {}): Promise<ListQuotesResponse> {
    const result = query
      ? await this.quoteRepository.search(query, { page, perPage })
      : await this.quoteRepository.findAll({ page, perPage });

    return {
      quotes: result.data,
      total: result.total,
      page: result.page,
      perPage: result.perPage,
      totalPages: result.totalPages,
    };
  }
}
