import { DomainError } from "@/src/shared/utils/errors/domain-error";

export class QuoteAlreadySubmittedError extends DomainError {
  constructor(options?: { cause?: unknown }) {
    super("Quote was already submitted", options);
  }
}
