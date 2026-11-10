/** Formato del código de un corredor: dos letras, guion y dos letras. */
export const corridorCodePattern = /^[A-Z]{2}-[A-Z]{2}$/;

/** Días de vigencia de una cotización (1 a 90), o null si no son válidos. */
export function parseValidityDays(text: string): number | null {
  if (!/^\d{1,2}$/.test(text.trim())) return null;
  const days = Number(text);
  return days >= 1 && days <= 90 ? days : null;
}
