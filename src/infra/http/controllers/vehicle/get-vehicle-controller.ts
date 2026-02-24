import type { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { GetVehicleUseCase } from "@/src/domain/vehicle/application/use-cases/get-vehicle";
import { vehicleIdParamsSchema } from "../../schemas/vehicle-schemas";
import { toHttpVehicle } from "../../presenters/vehicle-presenter";

export class GetVehicleController {
  constructor(private getVehicleUseCase: GetVehicleUseCase) {}

  handle = async (
    request: FastifyRequest<{ Params: z.input<typeof vehicleIdParamsSchema> }>,
    reply: FastifyReply,
  ) => {
    const parseResult = vehicleIdParamsSchema.safeParse(request.params);

    if (!parseResult.success) {
      return reply.status(400).send({
        message: "Validation failed",
        code: "VALIDATION_ERROR",
        details: parseResult.error.issues,
      });
    }

    const { id } = parseResult.data;

    const { vehicle } = await this.getVehicleUseCase.execute({
      vehicleId: id,
    });

    return reply.status(200).send({ vehicle: toHttpVehicle(vehicle) });
  };
}
