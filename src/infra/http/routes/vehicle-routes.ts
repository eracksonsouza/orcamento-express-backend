import type { FastifyInstance } from "fastify";
import { CreateVehicleController } from "../controllers/vehicle/create-vehicle-controller";
import { GetVehicleController } from "../controllers/vehicle/get-vehicle-controller";
import { ListVehiclesController } from "../controllers/vehicle/list-vehicles-controller";
import { ListVehiclesByCustomerController } from "../controllers/vehicle/list-vehicles-by-customer-controller";
import { UpdateVehicleController } from "../controllers/vehicle/update-vehicle-controller";
import { DeleteVehicleController } from "../controllers/vehicle/delete-vehicle-controller";
import { makeCreateVehicleUseCase } from "../factories/make-create-vehicle-use-case";
import { makeGetVehicleUseCase } from "../factories/make-get-vehicle-use-case";
import { makeListVehiclesUseCase } from "../factories/make-list-vehicles-use-case";
import { makeListVehiclesByCustomerUseCase } from "../factories/make-list-vehicles-by-customer-use-case";
import { makeUpdateVehicleUseCase } from "../factories/make-update-vehicle-use-case";
import { makeDeleteVehicleUseCase } from "../factories/make-delete-vehicle-use-case";

export async function vehicleRoutes(app: FastifyInstance) {
  const createVehicleController = new CreateVehicleController(
    makeCreateVehicleUseCase(),
  );
  const getVehicleController = new GetVehicleController(
    makeGetVehicleUseCase(),
  );
  const listVehiclesByCustomerController = new ListVehiclesByCustomerController(
    makeListVehiclesByCustomerUseCase(),
  );
  const updateVehicleController = new UpdateVehicleController(
    makeUpdateVehicleUseCase(),
  );
  const listVehiclesController = new ListVehiclesController(
    makeListVehiclesUseCase(),
  );
  const deleteVehicleController = new DeleteVehicleController(
    makeDeleteVehicleUseCase(),
  );

  app.post("/vehicles", createVehicleController.handle);
  app.get("/vehicles", listVehiclesController.handle);
  app.get("/vehicles/:id", getVehicleController.handle);
  app.get(
    "/customers/:customerId/vehicles",
    listVehiclesByCustomerController.handle,
  );
  app.patch("/vehicles/:id", updateVehicleController.handle);
  app.delete("/vehicles/:id", deleteVehicleController.handle);
}
