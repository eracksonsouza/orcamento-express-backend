import fastify from "fastify";
import fastifyCors from "@fastify/cors";

import { globalErrorHandler } from "./error-handler";
import { registerRoutes } from "./routes/index";

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

  await registerRoutes(app);

  return app;
}
