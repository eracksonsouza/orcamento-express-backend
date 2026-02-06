import { DomainError } from "./domain-error.js";

export class CustomerNotFoundError extends DomainError {
  constructor(options?: { cause?: unknown }) {
    super("Customer not found", options);
  }
}
