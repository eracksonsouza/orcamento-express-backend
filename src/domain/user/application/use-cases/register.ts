import { hash } from "bcryptjs";
import type { UserRepository } from "../repositories/user-repository";
import type { User } from "../../enterprise/entities/user";
import { User as UserEntity } from "../../enterprise/entities/user";
import { UserEmailAlreadyInUseError } from "../../enterprise/errors/email-already-in-use-error";
import { UniqueEntityId } from "@/src/core/entities/unique-entity-id";

interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

interface RegisterResponse {
  user: User;
}

export class RegisterUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute({ name, email, password }: RegisterRequest): Promise<RegisterResponse> {
    const existing = await this.userRepository.findByEmail(email);

    if (existing) {
      throw new UserEmailAlreadyInUseError();
    }

    const passwordHash = await hash(password, 12);

    const user = UserEntity.create(
      { name, email, passwordHash },
      new UniqueEntityId(),
    );

    await this.userRepository.save(user);

    return { user };
  }
}
