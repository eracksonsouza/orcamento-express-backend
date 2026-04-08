import type { FastifyReply, FastifyRequest } from "fastify";
import type { UserRole } from "@/src/domain/user/enterprise/enums/user-role";

export function verifyUserRole(...allowedRoles: UserRole[]) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    const { role } = request.user;

    if (!allowedRoles.includes(role)) {
      return reply.status(403).send({ message: "Forbidden.", code: "FORBIDDEN" });
    }
  };
}
