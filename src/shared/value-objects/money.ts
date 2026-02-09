export class Money {
  private readonly cents: number;

  private constructor(cents: number) {
    this.cents = cents;
  }

  /**
   * Cria Money a partir de um valor em reais (decimal).
   *
   * @example Money.fromDecimal(199.90) // R$ 199,90
   * @throws Error se o valor for negativo
   */
  static fromDecimal(value: number): Money {
    if (value < 0) {
      throw new Error(`Money cannot be negative: ${value}`);
    }

    // Arredonda para 2 casas decimais e converte para centavos
    const cents = Math.round(value * 100);
    return new Money(cents);
  }

  /**
   * Cria Money a partir de centavos (inteiro).
   *
   * @example Money.fromCents(19990) // R$ 199,90
   * @throws Error se o valor for negativo
   */
  static fromCents(cents: number): Money {
    if (cents < 0) {
      throw new Error(`Money cannot be negative: ${cents}`);
    }

    if (!Number.isInteger(cents)) {
      throw new Error(`Cents must be an integer: ${cents}`);
    }

    return new Money(cents);
  }

  /**
   * Cria Money zerado.
   */
  static zero(): Money {
    return new Money(0);
  }

  /**
   * Cria Money do banco de dados (Prisma retorna Decimal como string).
   */
  static fromPersistence(value: string | number): Money {
    const decimal = typeof value === "string" ? parseFloat(value) : value;
    return Money.fromDecimal(decimal);
  }

  /**
   * Retorna o valor em centavos (inteiro).
   */
  get inCents(): number {
    return this.cents;
  }

  /**
   * Retorna o valor em reais (decimal).
   */
  get inDecimal(): number {
    return this.cents / 100;
  }

  /**
   * Retorna o valor formatado em BRL.
   *
   * @example money.formatted // "R$ 199,90"
   */
  get formatted(): string {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(this.inDecimal);
  }

  /**
   * Soma dois valores Money.
   */
  add(other: Money): Money {
    return new Money(this.cents + other.cents);
  }

  /**
   * Subtrai um valor Money.
   *
   * @throws Error se o resultado for negativo
   */
  subtract(other: Money): Money {
    const result = this.cents - other.cents;

    if (result < 0) {
      throw new Error("Money subtraction would result in negative value");
    }

    return new Money(result);
  }

  /**
   * Multiplica por uma quantidade (ex: quantidade de itens).
   */
  multiply(quantity: number): Money {
    if (quantity < 0) {
      throw new Error(`Quantity cannot be negative: ${quantity}`);
    }

    const result = Math.round(this.cents * quantity);
    return new Money(result);
  }

  /**
   * Aplica um percentual de desconto.
   *
   * @param percent Percentual de 0 a 100
   * @example money.applyDiscount(10) // 10% de desconto
   */
  applyDiscount(percent: number): Money {
    if (percent < 0 || percent > 100) {
      throw new Error(`Discount percent must be between 0 and 100: ${percent}`);
    }

    const discountCents = Math.round(this.cents * (percent / 100));
    return new Money(this.cents - discountCents);
  }

  /**
   * Calcula o valor do desconto em Money.
   */
  calculateDiscount(percent: number): Money {
    if (percent < 0 || percent > 100) {
      throw new Error(`Discount percent must be between 0 and 100: ${percent}`);
    }

    const discountCents = Math.round(this.cents * (percent / 100));
    return new Money(discountCents);
  }

  /**
   * Verifica se é zero.
   */
  isZero(): boolean {
    return this.cents === 0;
  }

  /**
   * Verifica se é maior que outro Money.
   */
  greaterThan(other: Money): boolean {
    return this.cents > other.cents;
  }

  /**
   * Verifica se é menor que outro Money.
   */
  lessThan(other: Money): boolean {
    return this.cents < other.cents;
  }

  equals(other: Money): boolean {
    return this.cents === other.cents;
  }

  toString(): string {
    return this.formatted;
  }

  /**
   * Para serialização no banco (Prisma espera Decimal).
   */
  toPersistence(): number {
    return this.inDecimal;
  }
}
