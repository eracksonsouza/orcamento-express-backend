import fastify from "fastify";
import fastifyCors from "@fastify/cors";

import { globalErrorHandler } from "./error-handler";
import { customerRoutes } from "./routes/customer-routes";
import { vehicleRoutes } from "./routes/vehicle-routes";

export async function buildApp() {
  const app = fastify({
    logger: true,
  });

  await app.register(fastifyCors, {
    origin: true,
  });

  app.setErrorHandler(globalErrorHandler);

  app.get("/health", async () => {
    return { status: "ok", timestamp: new Date().toISOString() };
  });

  await app.register(customerRoutes);
  await app.register(vehicleRoutes);

  return app;
}
