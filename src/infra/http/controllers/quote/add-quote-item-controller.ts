import type { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { AddQuoteItemUseCase } from "@/src/domain/quote/application/use-cases/add-quote-item";
import {
  addQuoteItemParamsSchema,
  addQuoteItemBodySchema,
} from "../../schemas/quote-schemas";

export class AddQuoteItemController {
  constructor(private addQuoteItemUseCase: AddQuoteItemUseCase) {}

  handle = async (
    request: FastifyRequest<{
      Params: z.input<typeof addQuoteItemParamsSchema>;
      Body: z.input<typeof addQuoteItemBodySchema>;
    }>,
    reply: FastifyReply,
  ) => {
    const paramsResult = addQuoteItemParamsSchema.safeParse(request.params);
    const bodyResult = addQuoteItemBodySchema.safeParse(request.body);

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

    const { id } = paramsResult.data;
    const { unitPrice, quantity, type, description } = bodyResult.data;

    const { quoteId } = await this.addQuoteItemUseCase.execute({
      quoteId: id,
      unitPrice,
      quantity,
      type,
      ...(description !== undefined ? { description } : {}),
    });

    return reply.status(200).send({ quoteId });
  };
}
