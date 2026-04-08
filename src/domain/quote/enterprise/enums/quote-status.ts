export const QuoteStatus = {
  DRAFT: "DRAFT",
  SUBMITTED: "SUBMITTED",
  GENERATING: "GENERATING",
  READY: "READY",
  FAILED: "FAILED",
} as const;

export type QuoteStatus = (typeof QuoteStatus)[keyof typeof QuoteStatus];

export const QUOTE_STATUS_VALUES = Object.values(QuoteStatus);

export const VALID_STATUS_TRANSITIONS: Record<QuoteStatus, QuoteStatus[]> = {
  [QuoteStatus.DRAFT]: [QuoteStatus.SUBMITTED],
  [QuoteStatus.SUBMITTED]: [QuoteStatus.GENERATING],
  [QuoteStatus.GENERATING]: [QuoteStatus.READY, QuoteStatus.FAILED],
  [QuoteStatus.READY]: [],
  [QuoteStatus.FAILED]: [QuoteStatus.GENERATING],
};

export function isValidStatusTransition(
  from: QuoteStatus,
  to: QuoteStatus,
): boolean {
  return VALID_STATUS_TRANSITIONS[from].includes(to);
}

export function isEditableStatus(status: QuoteStatus): boolean {
  return (
    status === QuoteStatus.DRAFT ||
    status === QuoteStatus.SUBMITTED ||
    status === QuoteStatus.GENERATING
  );
}
