import type { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { UpdateQuoteItemUseCase } from "@/src/domain/quote/application/use-cases/update-quote-item";
import {
  updateQuoteItemParamsSchema,
  updateQuoteItemBodySchema,
} from "../../schemas/quote-schemas";
import { toHttpQuote } from "../../presenters/quote-presenter";

export class UpdateQuoteItemController {
  constructor(private updateQuoteItemUseCase: UpdateQuoteItemUseCase) {}

  handle = async (
    request: FastifyRequest<{
      Params: z.input<typeof updateQuoteItemParamsSchema>;
      Body: z.input<typeof updateQuoteItemBodySchema>;
    }>,
    reply: FastifyReply,
  ) => {
    const paramsResult = updateQuoteItemParamsSchema.safeParse(request.params);
    const bodyResult = updateQuoteItemBodySchema.safeParse(request.body);

    if (!paramsResult.success) {
      return reply.status(400).send({
        message: "Validation failed",
        code: "VALIDATION_ERROR",
        details: paramsResult.error.issues,
      });
    }

    if (!bodyResult.success) {
      return reply.status(400).send({
        message: "Validation failed",
        code: "VALIDATION_ERROR",
        details: bodyResult.error.issues,
      });
    }

    const { id, itemId } = paramsResult.data;
    const { unitPrice, quantity, type, description } = bodyResult.data;

    const { quote } = await this.updateQuoteItemUseCase.execute({
      quoteId: id,
      itemId,
      unitPrice,
      quantity,
      type,
      description,
    });

    return reply.status(200).send({ quote: toHttpQuote(quote) });
  };
}
