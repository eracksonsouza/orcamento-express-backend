import type {
  QuotePaymentMethod,
} from "../../enterprise/entities/quote";
import { QuoteNotFoundError } from "../../enterprise/errors/quote-not-found-error";
import type { QuoteRepository } from "../repositories/quote-repository";

interface UpdateQuoteCommercialTermsRequest {
  quoteId: string;
  discount?: number;
  taxes?: number;
  paymentDiscount?: number;
  paymentMethod?: QuotePaymentMethod;
}

interface UpdateQuoteCommercialTermsResponse {
  quoteId: string;
}

export class UpdateQuoteCommercialTermsUseCase {
  constructor(private quoteRepository: QuoteRepository) {}

  async execute({
    quoteId,
    discount,
    taxes,
    paymentDiscount,
    paymentMethod,
  }: UpdateQuoteCommercialTermsRequest): Promise<UpdateQuoteCommercialTermsResponse> {
    const quote = await this.quoteRepository.findById(quoteId);

    if (!quote) {
      throw new QuoteNotFoundError();
    }

    quote.updateCommercialTerms({
      ...(discount !== undefined ? { discount } : {}),
      ...(taxes !== undefined ? { taxes } : {}),
      ...(paymentDiscount !== undefined ? { paymentDiscount } : {}),
      ...(paymentMethod !== undefined ? { paymentMethod } : {}),
    });

    await this.quoteRepository.save(quote);

    return {
      quoteId: quote.id.toString(),
    };
  }
}
