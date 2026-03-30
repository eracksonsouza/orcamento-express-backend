import type { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { GetCustomerUseCase } from "@/src/domain/customer/application/use-cases/get-customer";
import { customerIdParamsSchema } from "../../schemas/customer-schemas";
import { toHttpCustomer } from "../../presenters/customer-presenter";

export class GetCustomerController {
  constructor(private getCustomerUseCase: GetCustomerUseCase) {}

  handle = async (
    request: FastifyRequest<{ Params: z.input<typeof customerIdParamsSchema> }>,
    reply: FastifyReply,
  ) => {
    const parseResult = customerIdParamsSchema.safeParse(request.params);

    if (!parseResult.success) {
      return reply.status(400).send({
        message: "Validation failed",
        code: "VALIDATION_ERROR",
        details: parseResult.error.issues,
      });
    }

    const { id } = parseResult.data;

    const { customer } = await this.getCustomerUseCase.execute({
      customerId: id,
    });

    return reply.status(200).send({ customer: toHttpCustomer(customer) });
  };
}
