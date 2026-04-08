import "@fastify/jwt";
import type { UserRole } from "@/src/domain/user/enterprise/enums/user-role";

declare module "@fastify/jwt" {
  interface FastifyJWT {
    payload: {
      role: UserRole;
    };
    user: {
      sub: string;
      role: UserRole;
    };
  }
}
