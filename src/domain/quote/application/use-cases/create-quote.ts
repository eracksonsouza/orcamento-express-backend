import type { QuoteRepository } from "../repositories/quote-repository";
import { Quote } from "../../enterprise/entities/quote";
import { QuoteStatus } from "@/src/domain/quote/enterprise/enums/quote-status";
import type { QuoteItem } from "../../enterprise/entities/quote-item";

interface CreateQuoteRequest {
  quoteId?: string;
  customerId: string;
  value: number;
  status: QuoteStatus;
  version: number;
  items: QuoteItem[];
  subtotal: number;
  total: number;
}

interface CreateQuoteResponse {
  quote: Quote;
}

export class CreateQuoteUseCase {
  constructor(private quoteRepository: QuoteRepository) {}

  async execute({
    quoteId,
    customerId,
    value,
    status,
    version,
    items,
    subtotal,
    total,
  }: CreateQuoteRequest): Promise<CreateQuoteResponse> {
    const quote = Quote.create(
      {
        customerId,
        value,
        status,
        version,
        items,
        subtotal,
        total,
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
