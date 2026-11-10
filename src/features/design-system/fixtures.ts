/** Fila de la comparación entre el diseño anterior y el actual. */
export interface DesignChange {
  element: string;
  before: string;
  after: string;
}

/** Qué cambió frente al diseño anterior. */
export const designChanges: DesignChange[] = [
  {
    element: "Portada",
    before: "Buque con titular y buscador de servicios debajo",
    after: "Buque a pantalla completa con el titular y el buscador encima",
  },
  {
    element: "Barra superior",
    before: "Navy de borde a borde, enlaces en mayúsculas",
    after: "Barra clara flotante con desplegable de Inicio; menú compacto en el teléfono",
  },
  { element: "Menú de los portales", before: "Columna navy pegada al borde", after: "Columna navy flotante con 28 px de radio" },
  {
    element: "Títulos",
    before: "Montserrat 500 con una palabra en degradado dorado",
    after: "Montserrat 700 sólido, sin degradados",
  },
  {
    element: "Etiquetas de sección",
    before: "Mayúsculas con tracking amplio",
    after: "Número y nombre en dorado texto: «02 · Verificados»",
  },
  {
    element: "Botones",
    before: "Píldora (999 px)",
    after: "Rectángulo suave de 14 a 16 px; las píldoras quedan para chips y estados",
  },
  { element: "Tarjetas", before: "16 px, todas del mismo tamaño", after: "24 a 28 px, en mosaico de tamaños distintos" },
  {
    element: "Movimiento",
    before: "Sin definir",
    after: "Sin animaciones: al pasar el cursor solo cambian sombra y color",
  },
];

/** Color de la paleta, con la clase de su token. */
export interface PaletteColor {
  name: string;
  hex: string;
  use: string;
  swatchClass: string;
}

/** Paleta de la marca. */
export const palette: PaletteColor[] = [
  { name: "Navy 950", hex: "#061024", use: "Portada, banda de proveedores y velo sobre la foto", swatchClass: "bg-navy-950" },
  { name: "Navy 900", hex: "#0B1B33", use: "Texto principal, botón oscuro y tarjeta destacada", swatchClass: "bg-navy-900" },
  { name: "Navy 800", hex: "#12274A", use: "Avatares y superficies oscuras secundarias", swatchClass: "bg-navy-800" },
  { name: "Dorado 500", hex: "#C9A45C", use: "Acción principal: Buscar, Registrar mi empresa", swatchClass: "bg-gold-500" },
  { name: "Dorado 300", hex: "#E8CB8E", use: "Acentos e iniciales sobre navy", swatchClass: "bg-gold-300" },
  { name: "Dorado texto", hex: "#8A6224", use: "Etiquetas numeradas y enlaces sobre claro", swatchClass: "bg-gold-text" },
  { name: "Arena", hex: "#F6ECD6", use: "Tarjeta cálida y etiquetas de categoría", swatchClass: "bg-sand" },
  { name: "Crema", hex: "#F3F0E8", use: "Fondo del selector Productos / Servicios", swatchClass: "bg-cream" },
  { name: "Ivory", hex: "#F7F5F0", use: "Fondo de la página y de los campos", swatchClass: "bg-ivory" },
  { name: "Blanco", hex: "#FFFFFF", use: "Tarjetas, buscador y menú", swatchClass: "bg-white" },
  { name: "Tinta", hex: "#3A4556", use: "Texto de lectura", swatchClass: "bg-ink" },
  { name: "Pizarra", hex: "#556070", use: "Texto secundario y metadatos", swatchClass: "bg-subtle" },
];

/** Par de texto sobre fondo con su razón de contraste. */
export interface ContrastPair {
  label: string;
  ratio: string;
  className: string;
}

/** Pares de contraste WCAG de la paleta. */
export const contrastPairs: ContrastPair[] = [
  { label: "Blanco / Navy 950", ratio: "19,0 : 1", className: "bg-navy-950 text-white" },
  { label: "Navy 950 / Dorado 500", ratio: "8,1 : 1", className: "bg-gold-500 text-navy-950" },
  { label: "Dorado 300 / Navy 900", ratio: "11,0 : 1", className: "bg-navy-900 text-gold-300" },
  { label: "Dorado texto / Ivory", ratio: "5,0 : 1", className: "bg-ivory text-gold-text" },
  { label: "Tinta / Ivory", ratio: "8,9 : 1", className: "bg-ivory text-ink" },
  { label: "Pizarra / Blanco", ratio: "6,4 : 1", className: "bg-white text-subtle" },
];

/** Estilo de la escala tipográfica, con su muestra. */
export interface TypeStyle {
  name: string;
  spec: string;
  sample: string;
  sampleClass: string;
}

/** Escala tipográfica. */
export const typeScale: TypeStyle[] = [
  {
    name: "Display · Montserrat 700",
    spec: "64 / 1,08 · −0,025 em",
    sample: "Del proveedor a tu bodega.",
    sampleClass: "font-display text-[clamp(34px,4.5vw,64px)] leading-[1.08] font-bold tracking-[-0.025em] text-navy-900",
  },
  {
    name: "Título de sección · Montserrat 700",
    spec: "46 / 1,12 · −0,02 em",
    sample: "Tres pasos. Tú decides en cada uno.",
    sampleClass: "font-display text-[clamp(28px,3.2vw,46px)] leading-[1.12] font-bold tracking-[-0.02em] text-navy-900",
  },
  {
    name: "Título de tarjeta · Montserrat 700",
    spec: "21 / 1,25",
    sample: "Una persona, no un formulario.",
    sampleClass: "font-display text-[21px] leading-[1.25] font-bold tracking-[-0.01em] text-navy-900",
  },
  {
    name: "Número de paso · Montserrat 700",
    spec: "56 · dorado 500",
    sample: "1 2 3",
    sampleClass: "font-display text-[56px] leading-none font-bold text-gold-500",
  },
  {
    name: "Entrada · Inter 400",
    spec: "18 / 1,55",
    sample: "Encuentra mayoristas y operadores logísticos aprobados por Global 360.",
    sampleClass: "max-w-[640px] text-lg leading-[1.55] text-ink",
  },
  {
    name: "Lectura · Inter 400",
    spec: "15 / 1,55",
    sample: "Tu asesor conversa contigo en el portal o por WhatsApp y coordina con los proveedores hasta la entrega.",
    sampleClass: "max-w-[640px] text-[15px] leading-[1.55] text-ink",
  },
  {
    name: "Etiqueta · Inter 600",
    spec: "13 · dorado texto",
    sample: "02 · Verificados",
    sampleClass: "text-[13px] font-semibold tracking-[0.02em] text-gold-text",
  },
  {
    name: "Interfaz · Inter 600",
    spec: "14 a 16",
    sample: "Productos · Servicios logísticos · Crear cuenta",
    sampleClass: "text-[15px] font-semibold text-navy-900",
  },
  {
    name: "Dato · Inter 600",
    spec: "cifras tabulares",
    sample: "COT-2026-000009 · US$ 2.800,00 · 6–9 días",
    sampleClass: "text-[15px] font-semibold text-navy-900 tabular-nums",
  },
];

/** Radios de la forma, de menor a mayor. */
export const radii: ReadonlyArray<{ label: string; use: string; className: string }> = [
  { label: "12 px", use: "Íconos, chips de ruta, botón de invertir", className: "rounded-field" },
  { label: "14 a 16 px", use: "Botones y segmentos", className: "rounded-btn" },
  { label: "18 a 20 px", use: "Campos, menú y barra superior", className: "rounded-tile" },
  { label: "24 a 28 px", use: "Tarjetas y buscador", className: "rounded-card" },
  { label: "32 a 36 px", use: "Bandas y bloques grandes", className: "rounded-[36px]" },
  { label: "Píldora", use: "Chips de categoría y estados", className: "rounded-full" },
];

/** Pasos de la escala de espaciado (px), con la clase de su ancho. */
export const spacingScale: ReadonlyArray<{ value: number; widthClass: string }> = [
  { value: 4, widthClass: "w-1" },
  { value: 8, widthClass: "w-2" },
  { value: 12, widthClass: "w-3" },
  { value: 16, widthClass: "w-4" },
  { value: 24, widthClass: "w-6" },
  { value: 32, widthClass: "w-8" },
  { value: 40, widthClass: "w-10" },
  { value: 56, widthClass: "w-14" },
  { value: 96, widthClass: "w-24" },
];

/** Niveles de profundidad. */
export const depthLevels: ReadonlyArray<{ label: string; use: string; className: string }> = [
  { label: "Reposo", use: "Borde de 1 px al 7 % de navy; sin sombra", className: "border border-[rgba(11,27,51,0.07)]" },
  {
    label: "Cursor encima",
    use: "Sombra suave y borde más marcado",
    className: "border border-[rgba(11,27,51,0.16)] shadow-[0_14px_32px_rgba(11,27,51,0.10)]",
  },
  { label: "Flotante", use: "Menú desplegable", className: "shadow-menu" },
  { label: "Sobre foto", use: "Buscador encima de la portada", className: "shadow-[0_30px_80px_rgba(0,0,0,0.35)]" },
];

/** Principios para decidir una pantalla nueva. */
export const principles: ReadonlyArray<{ number: string; title: string; text: string }> = [
  { number: "1", title: "Buscar antes que leer", text: "El buscador es lo primero que se ve en la portada y en el marketplace." },
  {
    number: "2",
    title: "Mostrar en vez de contar",
    text: "Los beneficios se explican con piezas reales: una cotización, un mensaje, un avance.",
  },
  {
    number: "3",
    title: "Una acción dorada",
    text: "Por vista hay un solo paso principal; lo demás va en navy, blanco o texto.",
  },
  {
    number: "4",
    title: "Quieto por defecto",
    text: "Sin animaciones. Al pasar el cursor solo cambian sombra, borde o fondo.",
  },
  {
    number: "5",
    title: "Hecho para el dedo",
    text: "Objetivos de 44 px como mínimo, menú compacto y buscador a todo el ancho en el teléfono.",
  },
];
