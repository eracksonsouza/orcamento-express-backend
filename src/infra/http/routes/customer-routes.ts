import type { FastifyInstance } from "fastify";
import { CreateCustomerController } from "../controllers/customer/create-customer-controller";
import { GetCustomerController } from "../controllers/customer/get-customer-controller";
import { ListCustomersController } from "../controllers/customer/list-customers-controller";
import { UpdateCustomerController } from "../controllers/customer/update-customer-controller";
import { makeCreateCustomerUseCase } from "../factories/make-create-customer-use-case";
import { makeGetCustomerUseCase } from "../factories/make-get-customer-use-case";
import { makeListCustomersUseCase } from "../factories/make-list-customers-use-case";
import { makeUpdateCustomerUseCase } from "../factories/make-update-customer-use-case";
import { verifyJWT } from "../middlewares/verify-jwt";

export async function customerRoutes(app: FastifyInstance) {
  app.addHook("preHandler", verifyJWT);

  const createCustomerController = new CreateCustomerController(
    makeCreateCustomerUseCase(),
  );
  const getCustomerController = new GetCustomerController(
    makeGetCustomerUseCase(),
  );
  const listCustomersController = new ListCustomersController(
    makeListCustomersUseCase(),
  );
  const updateCustomerController = new UpdateCustomerController(
    makeUpdateCustomerUseCase(),
  );

  app.post("/customers", createCustomerController.handle);
  app.get("/customers/:id", getCustomerController.handle);
  app.get("/customers", listCustomersController.handle);
  app.patch("/customers/:id", updateCustomerController.handle);
}
