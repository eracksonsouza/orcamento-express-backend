/**
 * Tipos de item em um orçamento
 *
 * - PART: Peça/produto físico
 * - SERVICE: Serviço/mão de obra
 */
export const QuoteItemType = {
  PART: "PART",
  SERVICE: "SERVICE",
} as const;

// Tipo derivado do objeto
export type QuoteItemType = (typeof QuoteItemType)[keyof typeof QuoteItemType];

// Array com todos os valores (útil para validações)
export const QUOTE_ITEM_TYPE_VALUES = Object.values(QuoteItemType);

/**
 * Verifica se um valor é um QuoteItemType válido
 */
export function isValidQuoteItemType(value: string): value is QuoteItemType {
  return QUOTE_ITEM_TYPE_VALUES.includes(value as QuoteItemType);
}

/**
 * Labels amigáveis para exibição
 */
export const QUOTE_ITEM_TYPE_LABELS: Record<QuoteItemType, string> = {
  [QuoteItemType.PART]: "Peça",
  [QuoteItemType.SERVICE]: "Serviço",
};
