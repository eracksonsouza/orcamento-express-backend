import type { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import type { RegisterUseCase } from "@/src/domain/user/application/use-cases/register";
import { registerBodySchema } from "../../schemas/auth-schemas";

export class RegisterController {
  constructor(private registerUseCase: RegisterUseCase) {}

  handle = async (
    request: FastifyRequest<{ Body: z.input<typeof registerBodySchema> }>,
    reply: FastifyReply,
  ) => {
    const parseResult = registerBodySchema.safeParse(request.body);

    if (!parseResult.success) {
      return reply.status(400).send({
        message: "Validation failed",
        code: "VALIDATION_ERROR",
        details: parseResult.error.issues,
      });
    }

    const { name, email, password } = parseResult.data;

    await this.registerUseCase.execute({ name, email, password });

    return reply.status(201).send();
  };
}
