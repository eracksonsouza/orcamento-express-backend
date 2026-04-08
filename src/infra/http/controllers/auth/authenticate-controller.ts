import type { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import type { AuthenticateUseCase } from "@/src/domain/user/application/use-cases/authenticate";
import { authenticateBodySchema } from "../../schemas/auth-schemas";

export class AuthenticateController {
  constructor(private authenticateUseCase: AuthenticateUseCase) {}

  handle = async (
    request: FastifyRequest<{ Body: z.input<typeof authenticateBodySchema> }>,
    reply: FastifyReply,
  ) => {
    const parseResult = authenticateBodySchema.safeParse(request.body);

    if (!parseResult.success) {
      return reply.status(400).send({
        message: "Validation failed",
        code: "VALIDATION_ERROR",
        details: parseResult.error.issues,
      });
    }

    const { email, password } = parseResult.data;

    const { user } = await this.authenticateUseCase.execute({ email, password });

    const token = await reply.jwtSign(
      { role: user.role },
      { sign: { sub: user.id.toString() } },
    );

    const refreshToken = await reply.jwtSign(
      { role: user.role },
      { sign: { sub: user.id.toString(), expiresIn: "7d" } },
    );

    return reply
      .setCookie("refreshToken", refreshToken, {
        path: "/",
        secure: true,
        sameSite: true,
        httpOnly: true,
      })
      .status(200)
      .send({ token });
  };
}
