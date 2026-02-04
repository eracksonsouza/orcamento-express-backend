import { describe, it, expect } from "vitest";
import { ItemOrcamento } from "./ItemOrcamento.js";

describe("ItemOrcamento", () => {
  // ==================== Criação ====================
  describe("create", () => {
    it("deve criar um item com dados válidos", () => {
      const item = ItemOrcamento.create({
        descricao: "Peça de motor",
        quantidade: 2,
        precoUnitario: 150.0,
      });

      expect(item.id).toBeDefined();
      expect(item.descricao).toBe("Peça de motor");
      expect(item.quantidade).toBe(2);
      expect(item.precoUnitario).toBe(150.0);
      expect(item.desconto).toBe(0);
      expect(item.taxas).toBe(0);
    });

    it("deve criar um item com desconto e taxas", () => {
      const item = ItemOrcamento.create({
        descricao: "Serviço de instalação",
        quantidade: 1,
        precoUnitario: 500.0,
        desconto: 50.0,
        taxas: 25.0,
      });

      expect(item.desconto).toBe(50.0);
      expect(item.taxas).toBe(25.0);
    });

    it("deve gerar um UUID único para cada item", () => {
      const item1 = ItemOrcamento.create({
        descricao: "Item 1",
        quantidade: 1,
        precoUnitario: 100,
      });

      const item2 = ItemOrcamento.create({
        descricao: "Item 2",
        quantidade: 1,
        precoUnitario: 100,
      });

      expect(item1.id).not.toBe(item2.id);
    });
  });

  // ==================== Validações ====================
  describe("validações", () => {
    it("deve lançar erro se descrição estiver vazia", () => {
      expect(() =>
        ItemOrcamento.create({
          descricao: "",
          quantidade: 1,
          precoUnitario: 100,
        }),
      ).toThrow("Descrição do item é obrigatória");
    });

    it("deve lançar erro se descrição for apenas espaços", () => {
      expect(() =>
        ItemOrcamento.create({
          descricao: "   ",
          quantidade: 1,
          precoUnitario: 100,
        }),
      ).toThrow("Descrição do item é obrigatória");
    });

    it("deve lançar erro se quantidade for zero", () => {
      expect(() =>
        ItemOrcamento.create({
          descricao: "Item",
          quantidade: 0,
          precoUnitario: 100,
        }),
      ).toThrow("Quantidade deve ser maior que zero");
    });

    it("deve lançar erro se quantidade for negativa", () => {
      expect(() =>
        ItemOrcamento.create({
          descricao: "Item",
          quantidade: -1,
          precoUnitario: 100,
        }),
      ).toThrow("Quantidade deve ser maior que zero");
    });

    it("deve lançar erro se quantidade não for inteiro", () => {
      expect(() =>
        ItemOrcamento.create({
          descricao: "Item",
          quantidade: 1.5,
          precoUnitario: 100,
        }),
      ).toThrow("Quantidade deve ser um número inteiro");
    });

    it("deve lançar erro se preço unitário for negativo", () => {
      expect(() =>
        ItemOrcamento.create({
          descricao: "Item",
          quantidade: 1,
          precoUnitario: -100,
        }),
      ).toThrow("Preço unitário não pode ser negativo");
    });

    it("deve permitir preço unitário zero (item gratuito)", () => {
      const item = ItemOrcamento.create({
        descricao: "Brinde",
        quantidade: 1,
        precoUnitario: 0,
      });

      expect(item.precoUnitario).toBe(0);
    });

    it("deve lançar erro se desconto for negativo", () => {
      expect(() =>
        ItemOrcamento.create({
          descricao: "Item",
          quantidade: 1,
          precoUnitario: 100,
          desconto: -10,
        }),
      ).toThrow("Desconto não pode ser negativo");
    });

    it("deve lançar erro se taxas forem negativas", () => {
      expect(() =>
        ItemOrcamento.create({
          descricao: "Item",
          quantidade: 1,
          precoUnitario: 100,
          taxas: -5,
        }),
      ).toThrow("Taxas não podem ser negativas");
    });
  });

  describe("cálculos", () => {
    it("deve calcular subtotal corretamente (quantidade * precoUnitario)", () => {
      const item = ItemOrcamento.create({
        descricao: "Peça",
        quantidade: 3,
        precoUnitario: 100.0,
      });

      expect(item.calcularSubtotal()).toBe(300.0);
    });

    it("deve calcular total corretamente (subtotal - desconto + taxas)", () => {
      const item = ItemOrcamento.create({
        descricao: "Peça",
        quantidade: 2,
        precoUnitario: 100.0,
        desconto: 20.0,
        taxas: 10.0,
      });

      expect(item.calcularTotal()).toBe(190.0);
    });

    it("deve calcular total igual ao subtotal quando não há desconto nem taxas", () => {
      const item = ItemOrcamento.create({
        descricao: "Peça",
        quantidade: 5,
        precoUnitario: 50.0,
      });

      expect(item.calcularTotal()).toBe(item.calcularSubtotal());
      expect(item.calcularTotal()).toBe(250.0);
    });
  });

  // ==================== Atualizações ====================
  describe("atualizações", () => {
    it("deve atualizar quantidade", () => {
      const item = ItemOrcamento.create({
        descricao: "Item",
        quantidade: 1,
        precoUnitario: 100,
      });

      item.atualizarQuantidade(5);
      expect(item.quantidade).toBe(5);
    });

    it("deve lançar erro ao atualizar quantidade para zero", () => {
      const item = ItemOrcamento.create({
        descricao: "Item",
        quantidade: 1,
        precoUnitario: 100,
      });

      expect(() => item.atualizarQuantidade(0)).toThrow(
        "Quantidade deve ser maior que zero",
      );
    });

    it("deve atualizar preço unitário", () => {
      const item = ItemOrcamento.create({
        descricao: "Item",
        quantidade: 1,
        precoUnitario: 100,
      });

      item.atualizarPrecoUnitario(200);
      expect(item.precoUnitario).toBe(200);
    });

    it("deve lançar erro ao atualizar preço para negativo", () => {
      const item = ItemOrcamento.create({
        descricao: "Item",
        quantidade: 1,
        precoUnitario: 100,
      });

      expect(() => item.atualizarPrecoUnitario(-50)).toThrow(
        "Preço unitário não pode ser negativo",
      );
    });

    it("deve atualizar desconto", () => {
      const item = ItemOrcamento.create({
        descricao: "Item",
        quantidade: 1,
        precoUnitario: 100,
      });

      item.atualizarDesconto(10);
      expect(item.desconto).toBe(10);
    });

    it("deve lançar erro se desconto for maior que subtotal", () => {
      const item = ItemOrcamento.create({
        descricao: "Item",
        quantidade: 1,
        precoUnitario: 100,
      });

      expect(() => item.atualizarDesconto(150)).toThrow(
        "Desconto não pode ser maior que o subtotal",
      );
    });

    it("deve atualizar taxas", () => {
      const item = ItemOrcamento.create({
        descricao: "Item",
        quantidade: 1,
        precoUnitario: 100,
      });

      item.atualizarTaxas(15);
      expect(item.taxas).toBe(15);
    });
  });

  describe("clonar", () => {
    it("deve clonar um item com novo id", () => {
      const original = ItemOrcamento.create({
        descricao: "Item original",
        quantidade: 2,
        precoUnitario: 100,
        desconto: 10,
        taxas: 5,
      });

      const clone = original.clonar();

      expect(clone.id).not.toBe(original.id);
      expect(clone.descricao).toBe(original.descricao);
      expect(clone.quantidade).toBe(original.quantidade);
      expect(clone.precoUnitario).toBe(original.precoUnitario);
      expect(clone.desconto).toBe(original.desconto);
      expect(clone.taxas).toBe(original.taxas);
    });
  });

  describe("restaurar", () => {
    it("deve restaurar item sem validação (para hidratação do banco)", () => {
      const item = ItemOrcamento.restaurar({
        id: "123e4567-e89b-12d3-a456-426614174000",
        descricao: "Item restaurado",
        quantidade: 1,
        precoUnitario: 100,
      });

      expect(item.id).toBe("123e4567-e89b-12d3-a456-426614174000");
    });
  });

  describe("toJSON", () => {
    it("deve serializar item corretamente", () => {
      const item = ItemOrcamento.create({
        descricao: "Item teste",
        quantidade: 3,
        precoUnitario: 50,
        desconto: 5,
        taxas: 2,
      });

      const json = item.toJSON();

      expect(json).toEqual({
        id: item.id,
        descricao: "Item teste",
        quantidade: 3,
        precoUnitario: 50,
        desconto: 5,
        taxas: 2,
      });
    });
  });
});
