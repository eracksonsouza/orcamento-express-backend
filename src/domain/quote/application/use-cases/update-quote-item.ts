import { QuoteNotFoundError } from "../../enterprise/errors/quote-not-found-error";
import type { QuoteItemType } from "../../enterprise/enums/quote-item-type";
import type { QuoteRepository } from "../repositories/quote-repository";

interface UpdateQuoteItemRequest {
  quoteId: string;
  itemId: string;
  unitPrice: number;
  quantity: number;
  type: QuoteItemType;
  description?: string | null;
}

interface UpdateQuoteItemResponse {
  quoteId: string;
}

export class UpdateQuoteItemUseCase {
  constructor(private quoteRepository: QuoteRepository) {}
  async execute({
    quoteId,
    itemId,
    unitPrice,
    quantity,
    type,
    description,
  }: UpdateQuoteItemRequest): Promise<UpdateQuoteItemResponse> {
    const quote = await this.quoteRepository.findById(quoteId);
    if (!quote) {
      throw new QuoteNotFoundError();
    }

    quote.updateItem(itemId, {
      unitPrice,
      quantity,
      type,
      ...(description !== undefined ? { description } : {}),
    });

    await this.quoteRepository.update(quote);

    return {
      quoteId: quote.id.toString(),
    };
  }
}
