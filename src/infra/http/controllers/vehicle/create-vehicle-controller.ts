import type { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { CreateVehicleUseCase } from "@/src/domain/vehicle/application/use-cases/create-vehicle";
import { createVehicleBodySchema } from "../../schemas/vehicle-schemas";
import { toHttpVehicle } from "../../presenters/vehicle-presenter";

export class CreateVehicleController {
  constructor(private createVehicleUseCase: CreateVehicleUseCase) {}

  handle = async (
    request: FastifyRequest<{ Body: z.input<typeof createVehicleBodySchema> }>,
    reply: FastifyReply,
  ) => {
    const parseResult = createVehicleBodySchema.safeParse(request.body);

    if (!parseResult.success) {
      return reply.status(400).send({
        message: "Validation failed",
        code: "VALIDATION_ERROR",
        details: parseResult.error.issues,
      });
    }

    const { vehicleId, brand, model, year, licensePlate, type } =
      parseResult.data;

    const { vehicle } = await this.createVehicleUseCase.execute({
      vehicleId,
      brand,
      model,
      year,
      licensePlate,
      type,
    });

    return reply.status(201).send({ vehicle: toHttpVehicle(vehicle) });
  };
}
