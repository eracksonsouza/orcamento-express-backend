import type { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { ListCustomersUseCase } from "@/src/domain/customer/application/use-cases/list-customers";
import { listCustomersQuerySchema } from "../../schemas/customer-schemas";
import { toHttpCustomer } from "../../presenters/customer-presenter";

export class ListCustomersController {
  constructor(private listCustomersUseCase: ListCustomersUseCase) {}

  handle = async (
    request: FastifyRequest<{
      Querystring: z.input<typeof listCustomersQuerySchema>;
    }>,
    reply: FastifyReply,
  ) => {
    const parseResult = listCustomersQuerySchema.safeParse(request.query);

    if (!parseResult.success) {
      return reply.status(400).send({
        message: "Validation failed",
        code: "VALIDATION_ERROR",
        details: parseResult.error.issues,
      });
    }

    const { page, perPage, query } = parseResult.data;

    const { customers, total, totalPages } =
      await this.listCustomersUseCase.execute({
        page,
        perPage,
        ...(query !== undefined ? { query } : {}),
      });

    return reply.status(200).send({
      customers: customers.map(toHttpCustomer),
      pagination: {
        page,
        perPage,
        total,
        totalPages,
      },
    });
  };
}
