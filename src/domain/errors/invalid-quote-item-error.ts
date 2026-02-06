import { DomainError } from "./domain-error.js";

export class InvalidQuoteItemError extends DomainError {
  constructor(message: string, options?: { cause?: unknown }) {
    super(message, options);
  }
}
