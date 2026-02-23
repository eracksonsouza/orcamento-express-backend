import type { QuoteRepository } from "../repositories/quote-repository";
import { Quote } from "../../enterprise/entities/quote";
import type { CustomerRepository } from "@/src/domain/customer/application/repositories/customer-repository";
import { CustomerNotFoundError } from "@/src/domain/customer/enterprise/errors/customer-not-found-error";

interface CreateQuoteRequest {
  quoteId?: string;
  customerId: string;
}

interface CreateQuoteResponse {
  quote: Quote;
}

export class CreateQuoteUseCase {
  constructor(
    private quoteRepository: QuoteRepository,
    private customerRepository: CustomerRepository,
  ) {}

  async execute({
    quoteId,
    customerId,
  }: CreateQuoteRequest): Promise<CreateQuoteResponse> {
    const customerExists = await this.customerRepository.exists(customerId);

    if (!customerExists) {
      throw new CustomerNotFoundError();
    }

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
