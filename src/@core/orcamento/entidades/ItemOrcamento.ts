import { randomUUID } from "node:crypto";

export interface ItemOrcamentoProps {
  id?: string;
  descricao: string;
  quantidade: number;
  precoUnitario: number;
  desconto?: number;
  taxas?: number;
}

export class ItemOrcamento {
  private readonly _id: string;
  private _descricao: string;
  private _quantidade: number;
  private _precoUnitario: number;
  private _desconto: number;
  private _taxas: number;

  private constructor(props: ItemOrcamentoProps) {
    this._id = props.id ?? randomUUID();
    this._descricao = props.descricao;
    this._quantidade = props.quantidade;
    this._precoUnitario = props.precoUnitario;
    this._desconto = props.desconto ?? 0;
    this._taxas = props.taxas ?? 0;
  }

  public static create(props: ItemOrcamentoProps): ItemOrcamento {
    ItemOrcamento.validarProps(props);
    return new ItemOrcamento(props);
  }

  public static restaurar(props: ItemOrcamentoProps): ItemOrcamento {
    return new ItemOrcamento(props);
  }

  private static validarProps(props: ItemOrcamentoProps): void {
    if (!props.descricao || props.descricao.trim().length === 0) {
      throw new Error("Descrição do item é obrigatória");
    }

    if (props.quantidade <= 0) {
      throw new Error("Quantidade deve ser maior que zero");
    }

    if (!Number.isInteger(props.quantidade)) {
      throw new Error("Quantidade deve ser um número inteiro");
    }

    if (props.precoUnitario < 0) {
      throw new Error("Preço unitário não pode ser negativo");
    }

    if (props.desconto !== undefined && props.desconto < 0) {
      throw new Error("Desconto não pode ser negativo");
    }

    if (props.taxas !== undefined && props.taxas < 0) {
      throw new Error("Taxas não podem ser negativas");
    }
  }

  public calcularSubtotal(): number {
    return this._quantidade * this._precoUnitario;
  }

  public calcularTotal(): number {
    const subtotal = this.calcularSubtotal();
    return subtotal - this._desconto + this._taxas;
  }

  public atualizarQuantidade(quantidade: number): void {
    if (quantidade <= 0) {
      throw new Error("Quantidade deve ser maior que zero");
    }
    if (!Number.isInteger(quantidade)) {
      throw new Error("Quantidade deve ser um número inteiro");
    }
    this._quantidade = quantidade;
  }

  public atualizarPrecoUnitario(precoUnitario: number): void {
    if (precoUnitario < 0) {
      throw new Error("Preço unitário não pode ser negativo");
    }
    this._precoUnitario = precoUnitario;
  }

  public atualizarDesconto(desconto: number): void {
    if (desconto < 0) {
      throw new Error("Desconto não pode ser negativo");
    }
    if (desconto > this.calcularSubtotal()) {
      throw new Error("Desconto não pode ser maior que o subtotal");
    }
    this._desconto = desconto;
  }

  public atualizarTaxas(taxas: number): void {
    if (taxas < 0) {
      throw new Error("Taxas não podem ser negativas");
    }
    this._taxas = taxas;
  }

  public clonar(): ItemOrcamento {
    return new ItemOrcamento({
      descricao: this._descricao,
      quantidade: this._quantidade,
      precoUnitario: this._precoUnitario,
      desconto: this._desconto,
      taxas: this._taxas,
    });
  }

  // Getters
  get id(): string {
    return this._id;
  }

  get descricao(): string {
    return this._descricao;
  }

  get quantidade(): number {
    return this._quantidade;
  }

  get precoUnitario(): number {
    return this._precoUnitario;
  }

  get desconto(): number {
    return this._desconto;
  }

  get taxas(): number {
    return this._taxas;
  }

  public toJSON(): ItemOrcamentoProps {
    return {
      id: this._id,
      descricao: this._descricao,
      quantidade: this._quantidade,
      precoUnitario: this._precoUnitario,
      desconto: this._desconto,
      taxas: this._taxas,
    };
  }
}
