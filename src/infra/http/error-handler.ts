import type { FastifyError, FastifyReply, FastifyRequest } from "fastify";
import { ZodError } from "zod";
import { CustomerNotFoundError } from "@/src/domain/customer/enterprise/errors/customer-not-found-error";
import { QuoteNotFoundError } from "@/src/domain/quote/enterprise/errors/quote-not-found-error";
import { VehicleNotFoundError } from "@/src/domain/vehicle/enterprise/errors/vehicle-not-found-error";
import { QuoteAlreadySubmittedError } from "@/src/domain/quote/enterprise/errors/quote-already-submitted-error";
import { InvalidQuoteItemError } from "@/src/domain/quote/enterprise/errors/invalid-quote-item-error";
import { EmptyQuoteError } from "@/src/domain/quote/enterprise/errors/empty-quote-error";
import { InvalidStatusTransitionError } from "@/src/domain/quote/enterprise/errors/invalid-status-transition-error";
import { EmailAlreadyInUseError } from "@/src/domain/customer/enterprise/errors/email-already-in-use-error";
import { PhoneAlreadyInUseError } from "@/src/domain/customer/enterprise/errors/phone-already-in-use-error";

export function globalErrorHandler(
  error: FastifyError | Error,
  request: FastifyRequest,
  reply: FastifyReply,
) {
  request.log.error(error);

  // Domain errors - 404
  if (
    error instanceof CustomerNotFoundError ||
    error instanceof QuoteNotFoundError ||
    error instanceof VehicleNotFoundError
  ) {
    return reply.status(404).send({
      message: error.message,
      code: "NOT_FOUND",
    });
  }

  // Domain errors - 400
  if (
    error instanceof InvalidQuoteItemError ||
    error instanceof EmptyQuoteError ||
    error instanceof InvalidStatusTransitionError
  ) {
    return reply.status(400).send({
      message: error.message,
      code: "BAD_REQUEST",
    });
  }

  // Domain errors - 409 (Conflict)
  if (
    error instanceof QuoteAlreadySubmittedError ||
    error instanceof EmailAlreadyInUseError ||
    error instanceof PhoneAlreadyInUseError
  ) {
    return reply.status(409).send({
      message: error.message,
      code: "CONFLICT",
    });
  }

  // Zod validation errors
  if (error instanceof ZodError) {
    return reply.status(400).send({
      message: "Validation failed",
      code: "VALIDATION_ERROR",
      details: error.issues,
    });
  }

  // Fastify errors
  if ("statusCode" in error && typeof error.statusCode === "number") {
    return reply.status(error.statusCode).send({
      message: error.message,
      code: error.statusCode >= 500 ? "INTERNAL_SERVER_ERROR" : "HTTP_ERROR",
    });
  }

  // Unknown errors
  return reply.status(500).send({
    message: "Internal server error",
    code: "INTERNAL_SERVER_ERROR",
  });
}
