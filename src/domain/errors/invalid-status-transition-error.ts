import type { QuoteStatus } from "../entities/enums/quote-status";
import { DomainError } from "./domain-error";

export class InvalidStatusTransitionError extends DomainError {
  readonly from: QuoteStatus;
  readonly to: QuoteStatus;

  constructor(
    from: QuoteStatus,
    to: QuoteStatus,
    options?: { cause?: unknown },
  ) {
    super(`Invalid status transition from ${from} to ${to}`, options);
    this.from = from;
    this.to = to;
  }
}
