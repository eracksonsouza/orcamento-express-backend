import { QuoteNotFoundError } from "../../enterprise/errors/quote-not-found-error";
import { QuoteItem } from "../../enterprise/entities/quote-item";
import type { QuoteItemType } from "../../enterprise/enums/quote-item-type";
import type { QuoteRepository } from "../repositories/quote-repository";

interface AddQuoteItemRequest {
  quoteId: string;
  unitPrice: number;
  quantity: number;
  type: QuoteItemType;
  description?: string | null;
}

interface AddQuoteItemResponse {
  quoteId: string;
}

export class AddQuoteItemUseCase {
  constructor(private quoteRepository: QuoteRepository) {}
  async execute({
    quoteId,
    unitPrice,
    quantity,
    type,
    description,
  }: AddQuoteItemRequest): Promise<AddQuoteItemResponse> {
    const quote = await this.quoteRepository.findById(quoteId);

    if (!quote) {
      throw new QuoteNotFoundError();
    }

    const quoteItem = QuoteItem.create({
      unitPrice,
      quantity,
      type,
      description,
    });

    quote.addItem(quoteItem);
    await this.quoteRepository.save(quote);

    return {
      quoteId: quote.id.toString(),
    };
  }
}
