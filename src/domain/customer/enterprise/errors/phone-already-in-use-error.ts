import { DomainError } from "@/src/shared/utils/errors/domain-error";

export class PhoneAlreadyInUseError extends DomainError {
  constructor(options?: { cause?: unknown }) {
    super("Phone already in use", options);
  }
}
