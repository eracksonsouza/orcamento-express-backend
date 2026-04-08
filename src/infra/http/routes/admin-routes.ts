import type { FastifyInstance } from "fastify";
import { AdminOverviewController } from "../controllers/admin/overview-controller";
import { makeGetOverviewUseCase } from "../factories/make-get-overview-use-case";
import { verifyJWT } from "../middlewares/verify-jwt";
import { verifyUserRole } from "../middlewares/verify-user-role";
import { UserRole } from "@/src/domain/user/enterprise/enums/user-role";

export async function adminRoutes(app: FastifyInstance) {
  const overviewController = new AdminOverviewController(makeGetOverviewUseCase());

  app.get(
    "/admin/overview",
    { onRequest: [verifyJWT, verifyUserRole(UserRole.ADMIN)] },
    overviewController.handle,
  );
}
