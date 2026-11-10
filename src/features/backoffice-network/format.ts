const months = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];

/** Escribe una fecha RFC 3339 en UTC como «10 nov 2026». */
export function formatDate(iso: string): string {
  const date = new Date(iso);
  return `${date.getUTCDate()} ${months[date.getUTCMonth()] ?? ""} ${date.getUTCFullYear()}`;
}

/** Día (AAAA-MM-DD, en UTC) de una fecha RFC 3339, para un `<input type="date">`. */
export function toDateInput(iso: string): string {
  return new Date(iso).toISOString().slice(0, 10);
}

/** «1 empresa», «3 empresas». */
export function countLabel(count: number, singular: string, plural: string): string {
  return `${count} ${count === 1 ? singular : plural}`;
}
