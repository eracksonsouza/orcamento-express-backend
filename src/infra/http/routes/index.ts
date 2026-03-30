import type { FastifyInstance } from "fastify";
import { customerRoutes } from "./customer-routes";
import { vehicleRoutes } from "./vehicle-routes";
import { quoteRoutes } from "./quote-routes";

export async function registerRoutes(app: FastifyInstance) {
  await app.register(customerRoutes);
  await app.register(vehicleRoutes);
  await app.register(quoteRoutes);
}
