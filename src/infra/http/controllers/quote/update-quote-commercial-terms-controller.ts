import type { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { UpdateQuoteCommercialTermsUseCase } from "@/src/domain/quote/application/use-cases/update-quote-commercial-terms";
import {
  updateQuoteCommercialTermsParamsSchema,
  updateQuoteCommercialTermsBodySchema,
} from "../../schemas/quote-schemas";
import { toHttpQuote } from "../../presenters/quote-presenter";

export class UpdateQuoteCommercialTermsController {
  constructor(
    private updateQuoteCommercialTermsUseCase: UpdateQuoteCommercialTermsUseCase,
  ) {}

  handle = async (
    request: FastifyRequest<{
      Params: z.input<typeof updateQuoteCommercialTermsParamsSchema>;
      Body: z.input<typeof updateQuoteCommercialTermsBodySchema>;
    }>,
    reply: FastifyReply,
  ) => {
    const paramsResult = updateQuoteCommercialTermsParamsSchema.safeParse(
      request.params,
    );
    const bodyResult = updateQuoteCommercialTermsBodySchema.safeParse(
      request.body,
    );

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
    const { discount, taxes, paymentDiscount, paymentMethod } = bodyResult.data;

    const { quote } = await this.updateQuoteCommercialTermsUseCase.execute({
      quoteId: id,
      discount,
      taxes,
      paymentDiscount,
      paymentMethod,
    });

    return reply.status(200).send({ quote: toHttpQuote(quote) });
  };
}
