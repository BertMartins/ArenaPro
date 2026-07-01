/**
 * Converte "2025-01-14" em Date local (sem UTC bugado)
 */
export function parseLocalDate(dateStr: string) {
  const [year, month, day] = dateStr.split("-").map(Number);
  // Usa meio-dia UTC para evitar deslocamento de fuso horário no frontend
  return new Date(Date.UTC(year, month - 1, day, 12, 0, 0));
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

/**
 * Converte string ISO do banco para Date sem deslocar o dia.
 * Usa o segmento YYYY-MM-DD e reposiciona em meio-dia UTC.
 */
export function parseGameDate(iso: string): Date {
  const dateOnly = iso.slice(0, 10); // "2026-07-02"
  const [year, month, day] = dateOnly.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day, 12, 0, 0));
}
