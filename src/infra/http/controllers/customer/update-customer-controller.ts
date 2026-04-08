import type { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { UpdateCustomerUseCase } from "@/src/domain/customer/application/use-cases/update-customer";
import { customerIdParamsSchema, updateCustomerBodySchema } from "../../schemas/customer-schemas";
import { toHttpCustomer } from "../../presenters/customer-presenter";

export class UpdateCustomerController {
  constructor(private updateCustomerUseCase: UpdateCustomerUseCase) {}

  handle = async (
    request: FastifyRequest<{
      Params: z.input<typeof customerIdParamsSchema>;
      Body: z.input<typeof updateCustomerBodySchema>;
    }>,
    reply: FastifyReply,
  ) => {
    const paramsResult = customerIdParamsSchema.safeParse(request.params);
    if (!paramsResult.success) {
      return reply.status(400).send({
        message: "Validation failed",
        code: "VALIDATION_ERROR",
        details: paramsResult.error.issues,
      });
    }

    const bodyResult = updateCustomerBodySchema.safeParse(request.body);
    if (!bodyResult.success) {
      return reply.status(400).send({
        message: "Validation failed",
        code: "VALIDATION_ERROR",
        details: bodyResult.error.issues,
      });
    }

    const { id } = paramsResult.data;
    const { name, email, phone } = bodyResult.data;

    const { customer } = await this.updateCustomerUseCase.execute({
      customerId: id,
      ...(name !== undefined ? { name } : {}),
      ...(email !== undefined ? { email: email ?? null } : {}),
      ...(phone !== undefined ? { phone: phone ?? null } : {}),
    });

    return reply.status(200).send({ customer: toHttpCustomer(customer) });
  };
}
