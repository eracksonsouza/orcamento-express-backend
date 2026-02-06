import { DomainError } from "./domain-error.js";

export class EmptyQuoteError extends DomainError {
  constructor(options?: { cause?: unknown }) {
    super("Quote is empty", options);
  }
}
