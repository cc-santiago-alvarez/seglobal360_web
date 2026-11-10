// Las variantes «Base» no llevan color (ni tamaño, en los títulos de tarjeta) para combinarlas
// sin clases en conflicto.

/** Contenedor de 1240 px de las secciones públicas. */
export const container = "mx-auto w-full max-w-[1240px] px-6";

/** Etiqueta numerada («02 · Verificados») sin color. */
export const eyebrowBase = "font-sans text-[13px] font-semibold tracking-[0.02em]";
/** Etiqueta numerada en dorado texto. */
export const eyebrow = `${eyebrowBase} text-gold-text`;

/** Título de sección en Montserrat 700, sin color. */
export const sectionTitleBase =
  "m-0 font-display text-[clamp(30px,3.6vw,46px)] leading-[1.12] font-bold tracking-[-0.02em] text-balance";
/** Título de sección en navy. */
export const sectionTitle = `${sectionTitleBase} text-navy-900`;

/** Texto que acompaña al título de sección. */
export const sectionLead = "m-0 text-base leading-[1.55] text-pretty text-ink";

/** Título de tarjeta en Montserrat 700, sin tamaño ni color. */
export const cardTitleBase = "m-0 font-display leading-[1.25] font-bold tracking-[-0.01em]";
/** Título de tarjeta de 21 px en navy. */
export const cardTitle = `${cardTitleBase} text-[21px] text-navy-900`;

/** Texto de lectura de una tarjeta, sin color. */
export const cardTextBase = "m-0 text-[15px] leading-[1.55]";
/** Texto de lectura de una tarjeta en tinta. */
export const cardText = `${cardTextBase} text-ink`;
