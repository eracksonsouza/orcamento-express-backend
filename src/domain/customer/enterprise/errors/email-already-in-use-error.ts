import { DomainError } from "@/src/shared/utils/errors/domain-error";

export class EmailAlreadyInUseError extends Error implements DomainError {
  constructor() {
    super("Email already in use");
    this.name = "EmailAlreadyInUseError";
  }
}
