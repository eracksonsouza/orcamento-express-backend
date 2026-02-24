import type { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { RemoveQuoteItemUseCase } from "@/src/domain/quote/application/use-cases/remove-quote-item";
import { removeQuoteItemParamsSchema } from "../../schemas/quote-schemas";
import { toHttpQuote } from "../../presenters/quote-presenter";

export class RemoveQuoteItemController {
  constructor(private removeQuoteItemUseCase: RemoveQuoteItemUseCase) {}

  handle = async (
    request: FastifyRequest<{
      Params: z.input<typeof removeQuoteItemParamsSchema>;
    }>,
    reply: FastifyReply,
  ) => {
    const parseResult = removeQuoteItemParamsSchema.safeParse(request.params);

    if (!parseResult.success) {
      return reply.status(400).send({
        message: "Validation failed",
        code: "VALIDATION_ERROR",
        details: parseResult.error.issues,
      });
    }

    const { id, itemId } = parseResult.data;

    const { quote } = await this.removeQuoteItemUseCase.execute({
      quoteId: id,
      itemId,
    });

    return reply.status(200).send({ quote: toHttpQuote(quote) });
  };
}
