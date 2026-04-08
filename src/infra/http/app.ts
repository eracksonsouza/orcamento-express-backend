import fastify from "fastify";
import fastifyCors from "@fastify/cors";
import fastifyJwt from "@fastify/jwt";
import fastifyCookie from "@fastify/cookie";
import fastifyRateLimit from "@fastify/rate-limit";

import { env } from "@/src/infra/env";
import { globalErrorHandler } from "./error-handler";
import { registerRoutes } from "./routes/index";

export async function buildApp() {
  const app = fastify({
    logger: true,
  });

  await app.register(fastifyCors, {
    origin: env.CORS_ORIGIN ? env.CORS_ORIGIN.split(",") : ["http://localhost:3000"],
    credentials: true,
  });

  await app.register(fastifyJwt, {
    secret: env.JWT_SECRET,
    cookie: { cookieName: "refreshToken", signed: false },
    sign: { expiresIn: "10m" },
  });

  await app.register(fastifyCookie);

  await app.register(fastifyRateLimit, {
    global: false,
    keyGenerator: (request) => request.ip,
  });

  app.setErrorHandler(globalErrorHandler);

  app.get("/health", async () => {
    return { status: "ok", timestamp: new Date().toISOString() };
  });

  await registerRoutes(app);

  return app;
}
