import { DomainError } from "@/src/shared/utils/errors/domain-error";

export class EmptyQuoteError extends DomainError {
  constructor(options?: { cause?: unknown }) {
    super("Quote is empty", options);
  }
}
