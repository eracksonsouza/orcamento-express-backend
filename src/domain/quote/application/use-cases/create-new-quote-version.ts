import type { QuoteRepository } from "../repositories/quote-repository";
import { QuoteNotFoundError } from "../../enterprise/errors/quote-not-found-error";
import type { Quote } from "../../enterprise/entities/quote";

interface CreateNewQuoteVersionRequest {
  quoteId: string;
}

interface CreateNewQuoteVersionResponse {
  quote: Quote;
}

export class CreateNewQuoteVersionUseCase {
  constructor(private quoteRepository: QuoteRepository) {}

  async execute({
    quoteId,
  }: CreateNewQuoteVersionRequest): Promise<CreateNewQuoteVersionResponse> {
    const quote = await this.quoteRepository.findById(quoteId);

    if (!quote) {
      throw new QuoteNotFoundError();
    }

    const newQuoteVersion = quote.cloneNextVersion();
    await this.quoteRepository.save(newQuoteVersion);

    return {
      quote: newQuoteVersion,
    };
  }
}
