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
import { InvalidCredentialsError } from "@/src/domain/user/enterprise/errors/invalid-credentials-error";
import { UserEmailAlreadyInUseError } from "@/src/domain/user/enterprise/errors/email-already-in-use-error";
import { UserNotFoundError } from "@/src/domain/user/enterprise/errors/user-not-found-error";

export function globalErrorHandler(
  error: FastifyError | Error,
  request: FastifyRequest,
  reply: FastifyReply,
) {

  if (error instanceof InvalidCredentialsError || error instanceof UserNotFoundError) {
    return reply.status(401).send({
      message: error.message,
      code: "UNAUTHORIZED",
    });
  }

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

  if (
    error instanceof QuoteAlreadySubmittedError ||
    error instanceof EmailAlreadyInUseError ||
    error instanceof PhoneAlreadyInUseError ||
    error instanceof UserEmailAlreadyInUseError
  ) {
    return reply.status(409).send({
      message: error.message,
      code: "CONFLICT",
    });
  }

  if (error instanceof ZodError) {
    return reply.status(400).send({
      message: "Validation failed",
      code: "VALIDATION_ERROR",
      details: error.issues,
    });
  }

  if ("statusCode" in error && typeof error.statusCode === "number") {
    return reply.status(error.statusCode).send({
      message: error.message,
      code: error.statusCode >= 500 ? "INTERNAL_SERVER_ERROR" : "HTTP_ERROR",
    });
  }

  request.log.error(error);
  return reply.status(500).send({
    message: "Internal server error",
    code: "INTERNAL_SERVER_ERROR",
  });
}
