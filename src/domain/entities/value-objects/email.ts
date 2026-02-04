export class Email {
  public readonly value: string;

  private constructor(email: string) {
    this.value = email;
  }

  /**
   * Valida e cria um Email.
   *
   * Regras de validação:
   * - Não pode ser vazio
   * - Deve conter @ e domínio válido
   * - Máximo 254 caracteres (RFC 5321)
   *
   * @throws Error se o email for inválido
   */
  static create(email: string): Email {
    const trimmed = email.trim().toLowerCase();

    if (!Email.isValid(trimmed)) {
      throw new Error(`Invalid email: ${email}`);
    }

    return new Email(trimmed);
  }

  /**
   * Cria um Email sem validação (para reconstituir do banco).
   * Use apenas quando o valor já foi validado anteriormente.
   */
  static createFromPersistence(email: string): Email {
    return new Email(email);
  }

  /**
   * Validação de email usando regex.
   * Baseado no padrão RFC 5322 simplificado.
   */
  static isValid(email: string): boolean {
    if (!email || email.length > 254) {
      return false;
    }

    // Regex simplificado mas robusto para emails
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return emailRegex.test(email);
  }

  equals(other: Email): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}
