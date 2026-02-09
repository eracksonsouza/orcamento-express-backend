import { DomainError } from "@/src/shared/utils/errors/domain-error";

export class InvalidQuoteItemError extends DomainError {
  constructor(message: string, options?: { cause?: unknown }) {
    super(message, options);
  }
}
