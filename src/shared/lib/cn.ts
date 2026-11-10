/** Une clases de Tailwind e ignora los valores vacíos. */
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

/** Devuelve las iniciales (máximo dos) de un nombre. */
export function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter((word) => /^[\p{L}\d]/u.test(word))
    .slice(0, 2)
    .map((word) => word.charAt(0).toUpperCase())
    .join("");
}
