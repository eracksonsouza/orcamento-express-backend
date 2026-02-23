import type { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { CreateCustomerUseCase } from "@/src/domain/customer/application/use-cases/create-customer";
import {
  createCustomerBodySchema,
} from "../schemas/customer-schemas";
import { toHttpCustomer } from "../presenters/customer-presenter";

export class CreateCustomerController {
  constructor(private createCustomerUseCase: CreateCustomerUseCase) {}

  handle = async (
    request: FastifyRequest<{ Body: z.input<typeof createCustomerBodySchema> }>,
    reply: FastifyReply,
  ) => {
    const parseResult = createCustomerBodySchema.safeParse(request.body);

    if (!parseResult.success) {
      return reply.status(400).send({
        message: "Validation failed",
        code: "VALIDATION_ERROR",
        details: parseResult.error.issues,
      });
    }

    const { customerId, name, email, phone } = parseResult.data;

    const { customer } = await this.createCustomerUseCase.execute({
      customerId,
      name,
      email,
      phone,
    });

    return reply.status(201).send({ customer: toHttpCustomer(customer) });
  };
}
