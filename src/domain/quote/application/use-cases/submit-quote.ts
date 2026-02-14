import { QuoteStatus } from "../../enterprise/enums/quote-status";
import { EmptyQuoteError } from "../../enterprise/errors/empty-quote-error";
import { InvalidStatusTransitionError } from "../../enterprise/errors/invalid-status-transition-error";
import { QuoteAlreadySubmittedError } from "../../enterprise/errors/quote-already-submitted-error";
import { QuoteNotFoundError } from "../../enterprise/errors/quote-not-found-error";
import type { QuoteRepository } from "../repositories/quote-repository";

interface SubmitQuoteRequest {
  quoteId: string;
}

interface SubmitQuoteResponse {
  quoteId: string;
  status: QuoteStatus;
  version: number;
}

export class SubmitQuoteUseCase {
  constructor(private quoteRepository: QuoteRepository) {}

  async execute({
    quoteId,
  }: SubmitQuoteRequest): Promise<SubmitQuoteResponse> {
    const quote = await this.quoteRepository.findById(quoteId);

    if (!quote) {
      throw new QuoteNotFoundError();
    }

    if (quote.status === QuoteStatus.SUBMITTED) {
      throw new QuoteAlreadySubmittedError();
    }

    if (quote.status !== QuoteStatus.DRAFT) {
      throw new InvalidStatusTransitionError(quote.status, QuoteStatus.SUBMITTED);
    }

    if (quote.items.length === 0) {
      throw new EmptyQuoteError();
    }

    quote.submit();
    await this.quoteRepository.save(quote);

    return {
      quoteId: quote.id.toString(),
      status: quote.status,
      version: quote.version,
    };
  }
}
