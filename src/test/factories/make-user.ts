import { hash } from "bcryptjs";
import { UniqueEntityId } from "@/src/core/entities/unique-entity-id";
import { User, type CreateUserProps } from "@/src/domain/user/enterprise/entities/user";

export async function makeUser(
  override: Partial<CreateUserProps> & { plainPassword?: string } = {},
  id?: UniqueEntityId,
) {
  const { plainPassword, ...rest } = override;

  const passwordHash = await hash(plainPassword ?? "valid-password-123", 1);

  return User.create(
    {
      name: "John Doe",
      email: "john.doe@example.com",
      passwordHash,
      ...rest,
    },
    id ?? new UniqueEntityId(),
  );
}
