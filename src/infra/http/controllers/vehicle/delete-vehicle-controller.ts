import type { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { DeleteVehicleUseCase } from "@/src/domain/vehicle/application/use-cases/delete-vehicle";
import { deleteVehicleParamsSchema } from "../../schemas/vehicle-schemas";

export class DeleteVehicleController {
  constructor(private deleteVehicleUseCase: DeleteVehicleUseCase) {}

  handle = async (
    request: FastifyRequest<{
      Params: z.input<typeof deleteVehicleParamsSchema>;
    }>,
    reply: FastifyReply,
  ) => {
    const parseResult = deleteVehicleParamsSchema.safeParse(request.params);

    if (!parseResult.success) {
      return reply.status(400).send({
        message: "Validation failed",
        code: "VALIDATION_ERROR",
        details: parseResult.error.issues,
      });
    }

    const { id } = parseResult.data;

    await this.deleteVehicleUseCase.execute({
      vehicleId: id,
    });

    return reply.status(204).send();
  };
}
