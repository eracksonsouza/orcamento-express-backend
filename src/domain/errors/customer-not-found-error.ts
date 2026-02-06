import { DomainError } from "./domain-error";

export class CustomerNotFoundError extends DomainError {
  constructor(options?: { cause?: unknown }) {
    super("Customer not found", options);
  }
}
