import type { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { SubmitQuoteUseCase } from "@/src/domain/quote/application/use-cases/submit-quote";
import { submitQuoteParamsSchema } from "../../schemas/quote-schemas";
import { toHttpQuote } from "../../presenters/quote-presenter";

export class SubmitQuoteController {
  constructor(private submitQuoteUseCase: SubmitQuoteUseCase) {}

  handle = async (
    request: FastifyRequest<{
      Params: z.input<typeof submitQuoteParamsSchema>;
    }>,
    reply: FastifyReply,
  ) => {
    const parseResult = submitQuoteParamsSchema.safeParse(request.params);

    if (!parseResult.success) {
      return reply.status(400).send({
        message: "Validation failed",
        code: "VALIDATION_ERROR",
        details: parseResult.error.issues,
      });
    }

    const { id } = parseResult.data;

    const { quote } = await this.submitQuoteUseCase.execute({
      quoteId: id,
    });

    return reply.status(200).send({ quote: toHttpQuote(quote) });
  };
}
