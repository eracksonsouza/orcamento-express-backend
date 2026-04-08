import type { FastifyReply, FastifyRequest } from "fastify";
import type { GetCurrentUserUseCase } from "@/src/domain/user/application/use-cases/get-current-user";

export class MeController {
  constructor(private getCurrentUserUseCase: GetCurrentUserUseCase) {}

  handle = async (request: FastifyRequest, reply: FastifyReply) => {
    const { user } = await this.getCurrentUserUseCase.execute({ userId: request.user.sub });

    return reply.status(200).send({
      user: {
        id: user.id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  };
}
