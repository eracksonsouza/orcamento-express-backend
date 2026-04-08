import { InMemoryUserRepository } from "@/src/test/repositories/in-memory-user-repository";
import { makeUser } from "@/src/test/factories/make-user";
import { RegisterUseCase } from "./register";
import { UserEmailAlreadyInUseError } from "../../enterprise/errors/email-already-in-use-error";
import { UserRole } from "../../enterprise/enums/user-role";
import { compare } from "bcryptjs";

let usersRepository: InMemoryUserRepository;
let sut: RegisterUseCase;

describe("Register Use Case", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUserRepository();
    sut = new RegisterUseCase(usersRepository);
  });

  test("should be able to register a new user", async () => {
    const { user } = await sut.execute({
      name: "John Doe",
      email: "john.doe@example.com",
      password: "secure-password",
    });

    expect(user.id).toBeTruthy();
    expect(usersRepository.items).toHaveLength(1);
    expect(usersRepository.items[0]?.id).toEqual(user.id);
  });

  test("should assign MEMBER role by default on registration", async () => {
    const { user } = await sut.execute({
      name: "John Doe",
      email: "john.doe@example.com",
      password: "secure-password",
    });

    expect(user.role).toBe(UserRole.MEMBER);
  });

  test("should not be able to register with ADMIN role (role is always MEMBER)", async () => {
    const { user } = await sut.execute({
      name: "Malicious Actor",
      email: "admin@evil.com",
      password: "some-password",
    });

    expect(user.role).toBe(UserRole.MEMBER);
    expect(user.role).not.toBe(UserRole.ADMIN);
  });

  test("should not be able to register with an already used email", async () => {
    const existingUser = await makeUser({ email: "taken@example.com" });
    await usersRepository.save(existingUser);

    await expect(() =>
      sut.execute({
        name: "Another Person",
        email: "taken@example.com",
        password: "another-password",
      }),
    ).rejects.toBeInstanceOf(UserEmailAlreadyInUseError);
  });

  test("should not persist user when email is already taken", async () => {
    const existingUser = await makeUser({ email: "taken@example.com" });
    await usersRepository.save(existingUser);

    await expect(() =>
      sut.execute({
        name: "Another Person",
        email: "taken@example.com",
        password: "another-password",
      }),
    ).rejects.toBeInstanceOf(UserEmailAlreadyInUseError);

    expect(usersRepository.items).toHaveLength(1);
  });

  test("should store password as bcrypt hash, never as plain text", async () => {
    const plainPassword = "my-plain-password";

    const { user } = await sut.execute({
      name: "John Doe",
      email: "john.doe@example.com",
      password: plainPassword,
    });

    expect(user.passwordHash).not.toBe(plainPassword);
    const isHashValid = await compare(plainPassword, user.passwordHash);
    expect(isHashValid).toBe(true);
  });

  test("should hash password with sufficient bcrypt cost (>= 10 rounds)", async () => {
    const { user } = await sut.execute({
      name: "John Doe",
      email: "john.doe@example.com",
      password: "some-password",
    });

    const costMatch = user.passwordHash.match(/^\$2[ab]\$(\d+)\$/);
    expect(costMatch).not.toBeNull();
    const cost = Number(costMatch![1]);
    expect(cost).toBeGreaterThanOrEqual(10);
  });

  test("should return user with id, name, email and role", async () => {
    const { user } = await sut.execute({
      name: "John Doe",
      email: "john.doe@example.com",
      password: "secure-password",
    });

    expect(user.id).toBeDefined();
    expect(user.name).toBe("John Doe");
    expect(user.email).toBe("john.doe@example.com");
    expect(user.role).toBeDefined();
  });

  test("should be able to register multiple users with different emails", async () => {
    await sut.execute({
      name: "User One",
      email: "one@example.com",
      password: "password-one",
    });

    await sut.execute({
      name: "User Two",
      email: "two@example.com",
      password: "password-two",
    });

    expect(usersRepository.items).toHaveLength(2);
  });
});
