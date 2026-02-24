import type { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { ListQuotesUseCase } from "@/src/domain/quote/application/use-cases/list-quotes";
import { listQuotesQuerySchema } from "../../schemas/quote-schemas";
import { toHttpQuote } from "../../presenters/quote-presenter";

export class ListQuotesController {
  constructor(private listQuotesUseCase: ListQuotesUseCase) {}

  handle = async (
    request: FastifyRequest<{
      Querystring: z.input<typeof listQuotesQuerySchema>;
    }>,
    reply: FastifyReply,
  ) => {
    const parseResult = listQuotesQuerySchema.safeParse(request.query);

    if (!parseResult.success) {
      return reply.status(400).send({
        message: "Validation failed",
        code: "VALIDATION_ERROR",
        details: parseResult.error.issues,
      });
    }

    const { page, perPage, query, customerId, status, startDate, endDate } =
      parseResult.data;

    const { quotes, total, totalPages } = await this.listQuotesUseCase.execute({
      page,
      perPage,
      ...(query !== undefined ? { query } : {}),
      ...(customerId !== undefined ? { customerId } : {}),
      ...(status !== undefined ? { status } : {}),
      ...(startDate !== undefined ? { startDate } : {}),
      ...(endDate !== undefined ? { endDate } : {}),
    });

    return reply.status(200).send({
      quotes: quotes.map(toHttpQuote),
      pagination: {
        page,
        perPage,
        total,
        totalPages,
      },
    });
  };
}
