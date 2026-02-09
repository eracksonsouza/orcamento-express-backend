export class LicensePlate {
  public readonly value: string;

  private constructor(licensePlate: string) {
    this.value = licensePlate;
  }

  /**
   * Valida e cria uma LicensePlate.
   *
   * Formatos aceitos:
   * - Antigo: ABC-1234 ou ABC1234
   * - Mercosul: ABC1D23 ou ABC-1D23
   *
   * Armazena em uppercase, sem hífen.
   *
   * @throws Error se a placa for inválida
   */
  static create(licensePlate: string): LicensePlate {
    const normalized = LicensePlate.normalize(licensePlate);

    if (!LicensePlate.isValid(normalized)) {
      throw new Error(`Invalid license plate: ${licensePlate}`);
    }

    return new LicensePlate(normalized);
  }

  /**
   * Cria uma LicensePlate sem validação (para reconstituir do banco).
   * Use apenas quando o valor já foi validado anteriormente.
   */
  static createFromPersistence(licensePlate: string): LicensePlate {
    return new LicensePlate(licensePlate);
  }

  /**
   * Normaliza a placa: remove hífen e converte para uppercase.
   */
  static normalize(licensePlate: string): string {
    return licensePlate.replace(/-/g, "").toUpperCase().trim();
  }

  /**
   * Valida se a placa está no formato correto.
   *
   * Formatos brasileiros:
   * - Antigo: 3 letras + 4 números (ABC1234)
   * - Mercosul: 3 letras + 1 número + 1 letra + 2 números (ABC1D23)
   */
  static isValid(licensePlate: string): boolean {
    const normalized = LicensePlate.normalize(licensePlate);

    // Formato antigo: ABC1234
    const oldFormat = /^[A-Z]{3}[0-9]{4}$/;

    // Formato Mercosul: ABC1D23
    const mercosulFormat = /^[A-Z]{3}[0-9][A-Z][0-9]{2}$/;

    return oldFormat.test(normalized) || mercosulFormat.test(normalized);
  }

  /**
   * Retorna a placa formatada com hífen.
   * - Antigo: ABC-1234
   * - Mercosul: ABC-1D23
   */
  formatted(): string {
    return `${this.value.slice(0, 3)}-${this.value.slice(3)}`;
  }

  equals(other: LicensePlate): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}
