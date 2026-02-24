import type { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { ListVehiclesByCustomerUseCase } from "@/src/domain/vehicle/application/use-cases/list-vehicles-by-customer";
import { customerIdParamsSchema } from "../../schemas/vehicle-schemas";
import { toHttpVehicle } from "../../presenters/vehicle-presenter";

export class ListVehiclesByCustomerController {
  constructor(
    private listVehiclesByCustomerUseCase: ListVehiclesByCustomerUseCase,
  ) {}

  handle = async (
    request: FastifyRequest<{
      Params: z.input<typeof customerIdParamsSchema>;
    }>,
    reply: FastifyReply,
  ) => {
    const parseResult = customerIdParamsSchema.safeParse(request.params);

    if (!parseResult.success) {
      return reply.status(400).send({
        message: "Validation failed",
        code: "VALIDATION_ERROR",
        details: parseResult.error.issues,
      });
    }

    const { customerId } = parseResult.data;

    const { vehicles } = await this.listVehiclesByCustomerUseCase.execute({
      customerId,
    });

    return reply.status(200).send({
      vehicles: vehicles.map(toHttpVehicle),
    });
  };
}
