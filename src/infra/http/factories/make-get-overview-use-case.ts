import { GetOverviewUseCase } from "@/src/domain/admin/application/use-cases/get-overview";
import prismaClient from "@/src/infra/database/prisma/client";

export function makeGetOverviewUseCase() {
  return new GetOverviewUseCase(prismaClient);
}
