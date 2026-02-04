export class Phone {
  public readonly value: string;

  private constructor(phone: string) {
    this.value = phone;
  }

  /**
   * Valida e cria um Phone.
   *
   * Regras de validação:
   * - Mínimo 10 dígitos (DDD + número)
   * - Máximo 11 dígitos (DDD + 9 + número)
   * - Aceita formatação: (11) 99999-9999 ou 11999999999
   *
   * Armazena apenas os dígitos (sem formatação).
   *
   * @throws Error se o telefone for inválido
   */
  static create(phone: string): Phone {
    const digitsOnly = Phone.extractDigits(phone);

    if (!Phone.isValid(digitsOnly)) {
      throw new Error(`Invalid phone: ${phone}`);
    }

    return new Phone(digitsOnly);
  }

  /**
   * Cria um Phone sem validação (para reconstituir do banco).
   * Use apenas quando o valor já foi validado anteriormente.
   */
  static createFromPersistence(phone: string): Phone {
    return new Phone(phone);
  }

  /**
   * Remove tudo que não é dígito.
   */
  static extractDigits(phone: string): string {
    return phone.replace(/\D/g, "");
  }

  /**
   * Valida se o telefone tem entre 10 e 11 dígitos.
   *
   * Formato brasileiro:
   * - Fixo: (XX) XXXX-XXXX (10 dígitos)
   * - Celular: (XX) 9XXXX-XXXX (11 dígitos)
   */
  static isValid(phone: string): boolean {
    const digits = Phone.extractDigits(phone);
    return digits.length >= 10 && digits.length <= 11;
  }

  /**
   * Retorna o telefone formatado: (XX) XXXXX-XXXX
   */
  get formatted(): string {
    const digits = this.value;

    if (digits.length === 11) {
      return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
    }

    if (digits.length === 10) {
      return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
    }

    return this.value;
  }

  /**
   * Retorna apenas o DDD.
   */
  get ddd(): string {
    return this.value.slice(0, 2);
  }

  /**
   * Retorna o número sem o DDD.
   */
  get number(): string {
    return this.value.slice(2);
  }

  equals(other: Phone): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}
