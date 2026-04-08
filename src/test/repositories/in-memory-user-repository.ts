import type { UserRepository } from "@/src/domain/user/application/repositories/user-repository";
import type { User } from "@/src/domain/user/enterprise/entities/user";

export class InMemoryUserRepository implements UserRepository {
  public items: User[] = [];

  async findById(id: string): Promise<User | null> {
    return this.items.find((user) => user.id.toString() === id) ?? null;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.items.find((user) => user.email === email) ?? null;
  }

  async save(user: User): Promise<void> {
    const index = this.items.findIndex(
      (item) => item.id.toString() === user.id.toString(),
    );

    if (index >= 0) {
      this.items[index] = user;
      return;
    }

    this.items.push(user);
  }
}
