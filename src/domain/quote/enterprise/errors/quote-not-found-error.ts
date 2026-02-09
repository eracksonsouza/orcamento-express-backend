import { DomainError } from "@/src/shared/utils/errors/domain-error";

export class QuoteNotFoundError extends DomainError {
  constructor(options?: { cause?: unknown }) {
    super("Quote not found", options);
  }
}
