import { DomainError } from "./domain-error";

export class EmptyQuoteError extends DomainError {
  constructor(options?: { cause?: unknown }) {
    super("Quote is empty", options);
  }
}
