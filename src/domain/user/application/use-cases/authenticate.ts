import { compare } from "bcryptjs";
import type { UserRepository } from "../repositories/user-repository";
import type { User } from "../../enterprise/entities/user";
import { InvalidCredentialsError } from "../../enterprise/errors/invalid-credentials-error";

interface AuthenticateRequest {
  email: string;
  password: string;
}

interface AuthenticateResponse {
  user: User;
}

export class AuthenticateUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute({ email, password }: AuthenticateRequest): Promise<AuthenticateResponse> {
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new InvalidCredentialsError();
    }

    const passwordMatch = await compare(password, user.passwordHash);

    if (!passwordMatch) {
      throw new InvalidCredentialsError();
    }

    return { user };
  }
}
