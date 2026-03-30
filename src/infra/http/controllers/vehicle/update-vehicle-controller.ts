import type { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { UpdateVehicleUseCase } from "@/src/domain/vehicle/application/use-cases/update-vehicle";
import {
  updateVehicleParamsSchema,
  updateVehicleBodySchema,
} from "../../schemas/vehicle-schemas";

export class UpdateVehicleController {
  constructor(private updateVehicleUseCase: UpdateVehicleUseCase) {}

  handle = async (
    request: FastifyRequest<{
      Params: z.input<typeof updateVehicleParamsSchema>;
      Body: z.input<typeof updateVehicleBodySchema>;
    }>,
    reply: FastifyReply,
  ) => {
    const paramsResult = updateVehicleParamsSchema.safeParse(request.params);
    const bodyResult = updateVehicleBodySchema.safeParse(request.body);

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
    const { brand, model, year, licensePlate, type } = bodyResult.data;

    const { vehicleId } = await this.updateVehicleUseCase.execute({
      vehicleId: id,
      ...(brand !== undefined ? { brand } : {}),
      ...(model !== undefined ? { model } : {}),
      ...(year !== undefined ? { year } : {}),
      ...(licensePlate !== undefined ? { licensePlate } : {}),
      ...(type !== undefined ? { type } : {}),
    });

    return reply.status(200).send({ vehicleId });
  };
}
