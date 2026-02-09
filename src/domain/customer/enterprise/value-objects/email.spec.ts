import { expect, test } from "vitest";
import { Email } from "./email";

test("should create a valid email", () => {
  // Teste de criação de email válido
  const email = Email.create("test@example.com");
  expect(email.value).toBe("test@example.com");
});

test("should throw error for invalid email", () => {
  const invalidEmails = [
    "",
    "plainaddress",
    "@no-local-part.com",
    "Outlook Contact <outlook-contact@domain.com>",
  ];

  invalidEmails.forEach((invalidEmail) => {
    expect(() => Email.create(invalidEmail)).toThrowError(
      `Invalid email: ${invalidEmail}`,
    );
  });
});

test("should create email from persistence", () => {
  //verifica se o email é criado corretamente a partir do banco de dados
  const email = Email.createFromPersistence("persisted@example.com");

  expect(email.value).toBe("persisted@example.com");
});
