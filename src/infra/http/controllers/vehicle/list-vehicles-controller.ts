import type { FastifyReply, FastifyRequest } from "fastify";
import type { z } from "zod";
import { ListVehiclesUseCase } from "@/src/domain/vehicle/application/use-cases/list-vehicles";
import { listVehiclesQuerySchema } from "../../schemas/vehicle-schemas";
import { toHttpVehicleWithCustomer } from "../../presenters/vehicle-presenter";

export class ListVehiclesController {
  constructor(private listVehiclesUseCase: ListVehiclesUseCase) {}

  handle = async (
    request: FastifyRequest<{
      Querystring: z.input<typeof listVehiclesQuerySchema>;
    }>,
    reply: FastifyReply,
  ) => {
    const parseResult = listVehiclesQuerySchema.safeParse(request.query);

    if (!parseResult.success) {
      return reply.status(400).send({
        message: "Validation failed",
        code: "VALIDATION_ERROR",
        details: parseResult.error.issues,
      });
    }

    const { search, page, perPage } = parseResult.data;

    const result = await this.listVehiclesUseCase.execute({
      ...(search !== undefined && { search }),
      page,
      perPage,
    });

    return reply.status(200).send({
      vehicles: result.vehicles.map(toHttpVehicleWithCustomer),
      total: result.total,
      page: result.page,
      perPage: result.perPage,
      totalPages: result.totalPages,
    });
  };
}
