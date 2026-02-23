import type { FastifyError, FastifyReply, FastifyRequest } from "fastify";

export function globalErrorHandler(
  error: FastifyError,
  request: FastifyRequest,
  reply: FastifyReply,
) {
  request.log.error(error);

  const statusCode =
    typeof error.statusCode === "number" ? error.statusCode : 500;

  return reply.status(statusCode).send({
    message: error.message,
  });
}
