import type { FastifyInstance } from "fastify";
import { AuthenticateController } from "../controllers/auth/authenticate-controller";
import { RefreshController } from "../controllers/auth/refresh-controller";
import { RegisterController } from "../controllers/auth/register-controller";
import { MeController } from "../controllers/auth/me-controller";
import { makeAuthenticateUseCase } from "../factories/make-authenticate-use-case";
import { makeRegisterUseCase } from "../factories/make-register-use-case";
import { makeGetCurrentUserUseCase } from "../factories/make-get-current-user-use-case";
import { makeRefreshUseCase } from "../factories/make-refresh-use-case";
import { verifyJWT } from "../middlewares/verify-jwt";

const authRateLimit = { config: { rateLimit: { max: 5, timeWindow: "1 minute" } } };

export async function authRoutes(app: FastifyInstance) {
  const authenticateController = new AuthenticateController(makeAuthenticateUseCase());
  const refreshController = new RefreshController(makeRefreshUseCase());
  const registerController = new RegisterController(makeRegisterUseCase());
  const meController = new MeController(makeGetCurrentUserUseCase());

  app.post("/users", authRateLimit, registerController.handle);
  app.post("/sessions", authRateLimit, authenticateController.handle);
  app.patch("/token/refresh", refreshController.handle);

  app.get("/me", { onRequest: [verifyJWT] }, meController.handle);
}
