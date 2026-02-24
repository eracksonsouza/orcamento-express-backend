import type { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { GetQuoteUseCase } from "@/src/domain/quote/application/use-cases/get-quote";
import { quoteIdParamsSchema } from "../../schemas/quote-schemas";
import { toHttpQuote } from "../../presenters/quote-presenter";

export class GetQuoteController {
  constructor(private getQuoteUseCase: GetQuoteUseCase) {}

  handle = async (
    request: FastifyRequest<{ Params: z.input<typeof quoteIdParamsSchema> }>,
    reply: FastifyReply,
  ) => {
    const parseResult = quoteIdParamsSchema.safeParse(request.params);

    if (!parseResult.success) {
      return reply.status(400).send({
        message: "Validation failed",
        code: "VALIDATION_ERROR",
        details: parseResult.error.issues,
      });
    }

    const { id } = parseResult.data;

    const { quote } = await this.getQuoteUseCase.execute({ quoteId: id });

    return reply.status(200).send({ quote: toHttpQuote(quote) });
  };
}
