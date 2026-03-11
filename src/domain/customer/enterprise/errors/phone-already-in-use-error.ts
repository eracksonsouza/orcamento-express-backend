import { DomainError } from "@/src/shared/utils/errors/domain-error";

export class PhoneAlreadyInUseError extends Error implements DomainError {
  constructor() {
    super("Phone already in use");
    this.name = "PhoneAlreadyInUseError";
  }
}
