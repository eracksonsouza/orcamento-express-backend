import { DomainError } from "./domain-error";

export class InvalidQuoteItemError extends DomainError {
  constructor(message: string, options?: { cause?: unknown }) {
    super(message, options);
  }
}
