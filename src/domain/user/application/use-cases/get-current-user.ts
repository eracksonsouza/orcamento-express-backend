import type { UserRepository } from "../repositories/user-repository";
import type { User } from "../../enterprise/entities/user";
import { UserNotFoundError } from "../../enterprise/errors/user-not-found-error";

interface GetCurrentUserRequest {
  userId: string;
}

interface GetCurrentUserResponse {
  user: User;
}

export class GetCurrentUserUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute({ userId }: GetCurrentUserRequest): Promise<GetCurrentUserResponse> {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new UserNotFoundError();
    }

    return { user };
  }
}
