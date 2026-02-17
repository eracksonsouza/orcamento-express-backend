import { DomainError } from "@/src/shared/utils/errors/domain-error";

export class VehicleNotFoundError extends DomainError {
  constructor(options?: { cause?: unknown }) {
    super("Vehicle not found", options);
  }
}
