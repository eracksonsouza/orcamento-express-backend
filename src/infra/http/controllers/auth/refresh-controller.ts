import type { FastifyReply, FastifyRequest } from "fastify";
import type { UserRepository } from "@/src/domain/user/application/repositories/user-repository";

export class RefreshController {
  constructor(private userRepository: UserRepository) {}

  handle = async (request: FastifyRequest, reply: FastifyReply) => {
    await request.jwtVerify({ onlyCookie: true });

    const sub = request.user.sub;

    const user = await this.userRepository.findById(sub);
    if (!user) {
      return reply.status(401).send({ message: "Unauthorized.", code: "UNAUTHORIZED" });
    }

    const token = await reply.jwtSign(
      { role: user.role },
      { sign: { sub } },
    );

    const refreshToken = await reply.jwtSign(
      { role: user.role },
      { sign: { sub, expiresIn: "7d" } },
    );

    return reply
      .setCookie("refreshToken", refreshToken, {
        path: "/",
        secure: true,
        sameSite: true,
        httpOnly: true,
      })
      .status(200)
      .send({ token });
  };
}
