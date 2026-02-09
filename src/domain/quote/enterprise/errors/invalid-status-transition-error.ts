import type { QuoteStatus } from "@/src/domain/quote/enterprise/enums/quote-status";
import { DomainError } from "@/src/shared/utils/errors/domain-error";

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
