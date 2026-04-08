import type { FastifyReply, FastifyRequest } from "fastify";
import type { GetOverviewUseCase } from "@/src/domain/admin/application/use-cases/get-overview";

export class AdminOverviewController {
  constructor(private getOverviewUseCase: GetOverviewUseCase) {}

  handle = async (_request: FastifyRequest, reply: FastifyReply) => {
    const overview = await this.getOverviewUseCase.execute();
    return reply.status(200).send(overview);
  };
}
