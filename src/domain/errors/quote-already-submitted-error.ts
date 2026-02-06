import { DomainError } from "./domain-error";

export class QuoteAlreadySubmittedError extends DomainError {
  constructor(options?: { cause?: unknown }) {
    super("Quote was already submitted", options);
  }
}
