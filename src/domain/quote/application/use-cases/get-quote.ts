import type { QuoteRepository } from "../repositories/quote-repository";
import { QuoteNotFoundError } from "@/src/domain/quote/enterprise/errors/quote-not-found-error";
import type { Quote } from "@/src/domain/quote/enterprise/entities/quote";

interface GetQuoteRequest {
  quoteId: string;
}

interface GetQuoteResponse {
  quote: Quote;
}

export class GetQuoteUseCase {
  constructor(private quoteRepository: QuoteRepository) {}

  async execute({ quoteId }: GetQuoteRequest): Promise<GetQuoteResponse> {
    const quote = await this.quoteRepository.findById(quoteId);

    if (!quote) {
      throw new QuoteNotFoundError();
    }

    return {
      quote,
    };
  }
}
