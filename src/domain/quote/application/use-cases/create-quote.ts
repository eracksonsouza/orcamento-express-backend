import type { QuoteRepository } from "../repositories/quote-repository";
import { Quote } from "../../enterprise/entities/quote";

interface CreateQuoteRequest {
  quoteId?: string;
  customerId: string;
}

interface CreateQuoteResponse {
  quote: Quote;
}

export class CreateQuoteUseCase {
  constructor(private quoteRepository: QuoteRepository) {}

  async execute({
    quoteId,
    customerId,
  }: CreateQuoteRequest): Promise<CreateQuoteResponse> {
    const quote = Quote.create(
      {
        customerId,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      quoteId,
    );

    await this.quoteRepository.save(quote);

    return {
      quote,
    };
  }
}
