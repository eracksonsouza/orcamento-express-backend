import { randomUUID } from "node:crypto";
import { ItemOrcamento, type ItemOrcamentoProps } from "./ItemOrcamento.js";

export enum StatusOrcamento {
  DRAFT = "DRAFT",
  SUBMITTED = "SUBMITTED",
  GENERATING = "GENERATING",
  READY = "READY",
  FAILED = "FAILED",
}

export interface OrcamentoProps {
  id?: string;
  clienteId: string;
  status?: StatusOrcamento;
  versao?: number;
  dataCriacao?: Date;
  itens?: ItemOrcamentoProps[];
}

export class Orcamento {
  private readonly _id: string;
  private readonly _clienteId: string;
  private _status: StatusOrcamento;
  private readonly _versao: number;
  private readonly _dataCriacao: Date;
  private readonly _itens: ItemOrcamento[];

  private constructor(props: OrcamentoProps) {
    this._id = props.id ?? randomUUID();
    this._clienteId = props.clienteId;
    this._status = props.status ?? StatusOrcamento.DRAFT;
    this._versao = props.versao ?? 1;
    this._dataCriacao = props.dataCriacao ?? new Date();
    this._itens = [];

    if (props.itens && props.itens.length > 0) {
      props.itens.forEach((itemProps) => {
        const item = ItemOrcamento.restaurar(itemProps);
        this._itens.push(item);
      });
    }
  }

  public static create(props: OrcamentoProps): Orcamento {
    Orcamento.validarProps(props);
    return new Orcamento(props);
  }

  public static restaurar(props: OrcamentoProps): Orcamento {
    return new Orcamento(props);
  }

  private static validarProps(props: OrcamentoProps): void {
    if (!props.clienteId || props.clienteId.trim().length === 0) {
      throw new Error("ClienteId é obrigatório");
    }

    if (!Orcamento.isValidUUID(props.clienteId)) {
      throw new Error("ClienteId deve ser um UUID válido");
    }
  }

  private static isValidUUID(uuid: string): boolean {
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
  }

  // ==================== Métodos de Negócio ====================

  public adicionarItem(
    itemProps: Omit<ItemOrcamentoProps, "id">,
  ): ItemOrcamento {
    this.validarPodeSerEditado();

    const item = ItemOrcamento.create(itemProps);
    this._itens.push(item);
    return item;
  }

  public removerItem(itemId: string): void {
    this.validarPodeSerEditado();

    const index = this._itens.findIndex((item) => item.id === itemId);
    if (index === -1) {
      throw new Error("Item não encontrado no orçamento");
    }
    this._itens.splice(index, 1);
  }

  public obterItem(itemId: string): ItemOrcamento | undefined {
    return this._itens.find((item) => item.id === itemId);
  }

  public calcularSubtotal(): number {
    return this._itens.reduce(
      (total, item) => total + item.calcularSubtotal(),
      0,
    );
  }

  public calcularDescontoTotal(): number {
    return this._itens.reduce((total, item) => total + item.desconto, 0);
  }

  public calcularTaxasTotal(): number {
    return this._itens.reduce((total, item) => total + item.taxas, 0);
  }

  public calcularValorTotal(): number {
    // Fórmula: subtotal - desconto + taxas
    return (
      this.calcularSubtotal() -
      this.calcularDescontoTotal() +
      this.calcularTaxasTotal()
    );
  }

  // ==================== Versionamento ====================

  public criarNovaVersao(): Orcamento {
    const itensClonados = this._itens.map((item) => item.clonar().toJSON());

    const novaVersao = new Orcamento({
      clienteId: this._clienteId,
      status: StatusOrcamento.DRAFT,
      versao: this._versao + 1,
      dataCriacao: new Date(),
      itens: itensClonados,
    });

    return novaVersao;
  }

  // ==================== Transições de Status ====================

  public submeter(): void {
    if (this._status !== StatusOrcamento.DRAFT) {
      throw new Error("Apenas orçamentos em DRAFT podem ser submetidos");
    }

    if (this._itens.length === 0) {
      throw new Error("Não é possível submeter um orçamento sem itens");
    }

    this._status = StatusOrcamento.SUBMITTED;
  }

  public iniciarGeracao(): void {
    if (this._status !== StatusOrcamento.SUBMITTED) {
      throw new Error("Apenas orçamentos SUBMITTED podem iniciar geração");
    }
    this._status = StatusOrcamento.GENERATING;
  }

  public finalizarGeracao(): void {
    if (this._status !== StatusOrcamento.GENERATING) {
      throw new Error("Apenas orçamentos em GENERATING podem ser finalizados");
    }
    this._status = StatusOrcamento.READY;
  }

  public marcarComoFalha(): void {
    if (this._status !== StatusOrcamento.GENERATING) {
      throw new Error(
        "Apenas orçamentos em GENERATING podem ser marcados como falha",
      );
    }
    this._status = StatusOrcamento.FAILED;
  }

  public voltarParaRascunho(): void {
    if (this._status === StatusOrcamento.GENERATING) {
      throw new Error(
        "Não é possível voltar para DRAFT enquanto o orçamento está sendo gerado",
      );
    }
    this._status = StatusOrcamento.DRAFT;
  }

  // ==================== Validações Internas ====================

  private validarPodeSerEditado(): void {
    if (this._status !== StatusOrcamento.DRAFT) {
      throw new Error("Apenas orçamentos em DRAFT podem ser editados");
    }
  }

  public podeSerEditado(): boolean {
    return this._status === StatusOrcamento.DRAFT;
  }

  public estaFinalizado(): boolean {
    return this._status === StatusOrcamento.READY;
  }

  public temItens(): boolean {
    return this._itens.length > 0;
  }

  // ==================== Getters ====================

  get id(): string {
    return this._id;
  }

  get clienteId(): string {
    return this._clienteId;
  }

  get status(): StatusOrcamento {
    return this._status;
  }

  get versao(): number {
    return this._versao;
  }

  get dataCriacao(): Date {
    return this._dataCriacao;
  }

  get itens(): ReadonlyArray<ItemOrcamento> {
    return [...this._itens];
  }

  get quantidadeItens(): number {
    return this._itens.length;
  }

  // ==================== Serialização ====================

  public toJSON(): OrcamentoProps & { valorTotal: number } {
    return {
      id: this._id,
      clienteId: this._clienteId,
      status: this._status,
      versao: this._versao,
      dataCriacao: this._dataCriacao,
      itens: this._itens.map((item) => item.toJSON()),
      valorTotal: this.calcularValorTotal(),
    };
  }
}
