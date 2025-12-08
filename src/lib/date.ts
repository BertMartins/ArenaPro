/**
 * Converte "2025-01-14" em Date local (sem UTC bugado)
 */
export function parseLocalDate(dateStr: string) {
  const [year, month, day] = dateStr.split("-").map(Number);
  return new Date(year, month - 1, day, 0, 0, 0);
}

/**
 * Retorna a data de hoje no horário local às 00:00:00
 */
export function todayLocal() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

/**
 * Formata data para PT-BR
 */
export function formatDateBR(date: Date) {
  return date.toLocaleDateString("pt-BR");
}
