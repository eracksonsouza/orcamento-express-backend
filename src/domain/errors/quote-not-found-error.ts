import { DomainError } from "./domain-error.js";

export class QuoteNotFoundError extends DomainError {
  constructor(options?: { cause?: unknown }) {
    super("Quote not found", options);
  }
}
