import type { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { CreateNewQuoteVersionUseCase } from "@/src/domain/quote/application/use-cases/create-new-quote-version";
import { createNewQuoteVersionParamsSchema } from "../../schemas/quote-schemas";
import { toHttpQuote } from "../../presenters/quote-presenter";

export class CreateNewQuoteVersionController {
  constructor(
    private createNewQuoteVersionUseCase: CreateNewQuoteVersionUseCase,
  ) {}

  handle = async (
    request: FastifyRequest<{
      Params: z.input<typeof createNewQuoteVersionParamsSchema>;
    }>,
    reply: FastifyReply,
  ) => {
    const parseResult = createNewQuoteVersionParamsSchema.safeParse(
      request.params,
    );

    if (!parseResult.success) {
      return reply.status(400).send({
        message: "Validation failed",
        code: "VALIDATION_ERROR",
        details: parseResult.error.issues,
      });
    }

    const { id } = parseResult.data;

    const { quote } = await this.createNewQuoteVersionUseCase.execute({
      quoteId: id,
    });

    return reply.status(201).send({ quote: toHttpQuote(quote) });
  };
}
