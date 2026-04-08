import { InMemoryUserRepository } from "@/src/test/repositories/in-memory-user-repository";
import { makeUser } from "@/src/test/factories/make-user";
import { AuthenticateUseCase } from "./authenticate";
import { InvalidCredentialsError } from "../../enterprise/errors/invalid-credentials-error";

let usersRepository: InMemoryUserRepository;
let sut: AuthenticateUseCase;

describe("Authenticate Use Case", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUserRepository();
    sut = new AuthenticateUseCase(usersRepository);
  });

  test("should be able to authenticate with valid credentials", async () => {
    const user = await makeUser({ plainPassword: "correct-password" });
    await usersRepository.save(user);

    const { user: authenticated } = await sut.execute({
      email: user.email,
      password: "correct-password",
    });

    expect(authenticated.id).toEqual(user.id);
    expect(authenticated.email).toBe(user.email);
  });

  test("should not be able to authenticate with wrong password", async () => {
    const user = await makeUser({ plainPassword: "correct-password" });
    await usersRepository.save(user);

    await expect(() =>
      sut.execute({ email: user.email, password: "wrong-password" }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
  });

  test("should not be able to authenticate with non-existing email", async () => {
    await expect(() =>
      sut.execute({ email: "ghost@example.com", password: "any-password" }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
  });

  test("should return the same error for non-existing email and wrong password (prevent user enumeration)", async () => {
    const user = await makeUser({ plainPassword: "correct-password" });
    await usersRepository.save(user);

    let errorForWrongPassword: Error | undefined;
    let errorForNonExistingEmail: Error | undefined;

    try {
      await sut.execute({ email: user.email, password: "wrong-password" });
    } catch (err) {
      errorForWrongPassword = err as Error;
    }

    try {
      await sut.execute({
        email: "ghost@example.com",
        password: "any-password",
      });
    } catch (err) {
      errorForNonExistingEmail = err as Error;
    }

    expect(errorForWrongPassword).toBeInstanceOf(InvalidCredentialsError);
    expect(errorForNonExistingEmail).toBeInstanceOf(InvalidCredentialsError);
    expect(errorForWrongPassword?.message).toBe(
      errorForNonExistingEmail?.message,
    );
  });

  test("should not be able to authenticate with email in different case (documents current behavior)", async () => {
    const user = await makeUser({
      email: "user@example.com",
      plainPassword: "correct-password",
    });
    await usersRepository.save(user);

    await expect(() =>
      sut.execute({ email: "USER@EXAMPLE.COM", password: "correct-password" }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
  });

  test("should not be able to authenticate with empty email", async () => {
    await expect(() =>
      sut.execute({ email: "", password: "some-password" }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
  });

  test("should not be able to authenticate with empty password", async () => {
    const user = await makeUser({ plainPassword: "correct-password" });
    await usersRepository.save(user);

    await expect(() =>
      sut.execute({ email: user.email, password: "" }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
  });

  test("should not be able to authenticate using password hash as password (bcrypt compare integrity)", async () => {
    const user = await makeUser({ plainPassword: "correct-password" });
    await usersRepository.save(user);

    await expect(() =>
      sut.execute({ email: user.email, password: user.passwordHash }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
  });

  test("should return user with all required fields", async () => {
    const user = await makeUser({ plainPassword: "correct-password" });
    await usersRepository.save(user);

    const { user: authenticated } = await sut.execute({
      email: user.email,
      password: "correct-password",
    });

    expect(authenticated.id).toBeDefined();
    expect(authenticated.name).toBeDefined();
    expect(authenticated.email).toBeDefined();
    expect(authenticated.role).toBeDefined();
    expect(authenticated.passwordHash).toBeDefined();
  });
});
