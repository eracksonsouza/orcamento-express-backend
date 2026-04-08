export const QuoteItemType = {
  PART: "PART",
  SERVICE: "SERVICE",
} as const;

export type QuoteItemType = (typeof QuoteItemType)[keyof typeof QuoteItemType];

export const QUOTE_ITEM_TYPE_VALUES = Object.values(QuoteItemType);

export function isValidQuoteItemType(value: string): value is QuoteItemType {
  return QUOTE_ITEM_TYPE_VALUES.includes(value as QuoteItemType);
}

export const QUOTE_ITEM_TYPE_LABELS: Record<QuoteItemType, string> = {
  [QuoteItemType.PART]: "Peça",
  [QuoteItemType.SERVICE]: "Serviço",
};
