import type { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { CreateQuoteUseCase } from "@/src/domain/quote/application/use-cases/create-quote";
import { createQuoteBodySchema } from "../../schemas/quote-schemas";
import { toHttpQuote } from "../../presenters/quote-presenter";

export class CreateQuoteController {
  constructor(private createQuoteUseCase: CreateQuoteUseCase) {}

  handle = async (
    request: FastifyRequest<{ Body: z.input<typeof createQuoteBodySchema> }>,
    reply: FastifyReply,
  ) => {
    const parseResult = createQuoteBodySchema.safeParse(request.body);

    if (!parseResult.success) {
      return reply.status(400).send({
        message: "Validation failed",
        code: "VALIDATION_ERROR",
        details: parseResult.error.issues,
      });
    }

    const { quoteId, customerId } = parseResult.data;

    const { quote } = await this.createQuoteUseCase.execute({
      customerId,
      ...(quoteId !== undefined ? { quoteId } : {}),
    });

    return reply.status(201).send({ quote: toHttpQuote(quote) });
  };
}
