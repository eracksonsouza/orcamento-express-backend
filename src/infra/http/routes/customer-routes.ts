import type { FastifyInstance } from "fastify";
import { CreateCustomerController } from "../controllers/create-customer-controller";
import { GetCustomerController } from "../controllers/get-customer-controller";
import { ListCustomersController } from "../controllers/list-customers-controller";
import { makeCreateCustomerUseCase } from "../factories/make-create-customer-use-case";
import { makeGetCustomerUseCase } from "../factories/make-get-customer-use-case";
import { makeListCustomersUseCase } from "../factories/make-list-customers-use-case";

export async function customerRoutes(app: FastifyInstance) {
  const createCustomerController = new CreateCustomerController(
    makeCreateCustomerUseCase(),
  );
  const getCustomerController = new GetCustomerController(
    makeGetCustomerUseCase(),
  );
  const listCustomersController = new ListCustomersController(
    makeListCustomersUseCase(),
  );

  app.post("/customers", createCustomerController.handle);
  app.get("/customers/:id", getCustomerController.handle);
  app.get("/customers", listCustomersController.handle);
}
