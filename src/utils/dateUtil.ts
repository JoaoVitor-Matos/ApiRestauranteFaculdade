/**
 * Retorna o início exato (00:00:00.000) da data fornecida.
 * Se nenhuma data for fornecida, usa o dia atual.
 * @param date A data para calcular o início (opcional).
 * @returns A string ISO formatada para o início do dia.
 */
export const getStartOfDay = (date: Date = new Date()): string => {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);
  const offset = start.getTimezoneOffset() * 60000;
  const localStart = new Date(start.getTime() - offset);
  return localStart.toISOString().slice(0, -1);
};

export const getEndOfDay = (date: Date = new Date()): string => {
  const end = new Date(date);
  end.setHours(23, 59, 59, 999);
  const offset = end.getTimezoneOffset() * 60000;
  const localEnd = new Date(end.getTime() - offset);
  return localEnd.toISOString().slice(0, -1);
};