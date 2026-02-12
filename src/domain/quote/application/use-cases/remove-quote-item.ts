import { QuoteNotFoundError } from "../../enterprise/errors/quote-not-found-error";
import type { QuoteRepository } from "../repositories/quote-repository";

interface RemoveQuoteItemRequest {
  quoteId: string;
  itemId: string;
}

interface RemoveQuoteItemResponse {
  quoteId: string;
}

export class RemoveQuoteItemUseCase {
  constructor(private quoteRepository: QuoteRepository) {}
  async execute({
    quoteId,
    itemId,
  }: RemoveQuoteItemRequest): Promise<RemoveQuoteItemResponse> {
    const quote = await this.quoteRepository.findById(quoteId);

    if (!quote) {
      throw new QuoteNotFoundError();
    }

    quote.removeItem(itemId);

    await this.quoteRepository.save(quote);

    return { quoteId };
  }
}
