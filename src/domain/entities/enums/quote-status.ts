/**
 * Status possíveis de um orçamento (Quote)
 *
 * Fluxo de transição:
 *   DRAFT → SUBMITTED → GENERATING → READY
 *                    ↘            ↘ FAILED
 *
 * - DRAFT: Rascunho, pode ser editado
 * - SUBMITTED: Enviado, ainda editável até iniciar geração
 * - GENERATING: Gerando arquivos (PDF/XLSX), ainda editável
 * - READY: Arquivos prontos para download
 * - FAILED: Falha na geração de arquivos
 */
export const QuoteStatus = {
  DRAFT: "DRAFT",
  SUBMITTED: "SUBMITTED",
  GENERATING: "GENERATING",
  READY: "READY",
  FAILED: "FAILED",
} as const;

// Tipo derivado do objeto
export type QuoteStatus = (typeof QuoteStatus)[keyof typeof QuoteStatus];

// Array com todos os valores (útil para validações)
export const QUOTE_STATUS_VALUES = Object.values(QuoteStatus);

// Transições válidas de status
export const VALID_STATUS_TRANSITIONS: Record<QuoteStatus, QuoteStatus[]> = {
  [QuoteStatus.DRAFT]: [QuoteStatus.SUBMITTED],
  [QuoteStatus.SUBMITTED]: [QuoteStatus.GENERATING],
  [QuoteStatus.GENERATING]: [QuoteStatus.READY, QuoteStatus.FAILED],
  [QuoteStatus.READY]: [], // Estado final
  [QuoteStatus.FAILED]: [QuoteStatus.GENERATING], // Pode retentar
};

/**
 * Verifica se uma transição de status é válida
 */
export function isValidStatusTransition(
  from: QuoteStatus,
  to: QuoteStatus,
): boolean {
  return VALID_STATUS_TRANSITIONS[from].includes(to);
}

/**
 * Verifica se o status permite edição do orçamento
 */
export function isEditableStatus(status: QuoteStatus): boolean {
  // Permite editar enquanto ainda não há arquivos prontos
  return (
    status === QuoteStatus.DRAFT ||
    status === QuoteStatus.SUBMITTED ||
    status === QuoteStatus.GENERATING
  );
}
