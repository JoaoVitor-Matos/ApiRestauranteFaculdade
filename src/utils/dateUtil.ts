/**
 * Retorna o início exato (00:00:00.000) da data fornecida.
 * Se nenhuma data for fornecida, usa o dia atual.
 * @param date A data para calcular o início (opcional).
 * @returns A string ISO formatada para o início do dia.
 */
export const getStartOfDay = (date: Date = new Date()): string => {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);
  return start.toISOString();
};

/**
 * Retorna o fim exato (23:59:59.999) da data fornecida.
 * Se nenhuma data for fornecida, usa o dia atual.
 * @param date A data para calcular o fim (opcional).
 * @returns A string ISO formatada para o fim do dia.
 */
export const getEndOfDay = (date: Date = new Date()): string => {
  const end = new Date(date);
  end.setHours(23, 59, 59, 999);
  return end.toISOString();
};