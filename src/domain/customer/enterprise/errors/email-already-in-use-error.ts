import { DomainError } from "@/src/shared/utils/errors/domain-error";

export class EmailAlreadyInUseError extends DomainError {
  constructor(options?: { cause?: unknown }) {
    super("Email already in use", options);
  }
}
