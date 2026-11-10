import { eyebrow } from "@/features/site/styles";
import { cn } from "@/shared/lib/cn";
import { Card } from "@/shared/ui/Card";
import { DocSection } from "./DocSection";
import { contrastPairs, depthLevels, designChanges, palette, radii, spacingScale, typeScale } from "./fixtures";

const boxed = "min-w-0 rounded-card border border-[rgba(11,27,51,0.07)] bg-white";
const note = "m-0 text-sm leading-normal text-subtle";
const headCell = "px-4 py-3.5 text-left text-xs font-semibold tabular-nums";
const bodyCell = "border-t border-line px-4 py-3.5 align-top text-sm leading-normal";

/** 01 · Comparación con el diseño anterior. */
export function ChangesSection() {
  return (
    <DocSection
      id="sec1"
      number="01"
      title="Qué cambió frente al diseño anterior"
      description="La paleta y las tipografías de seglobal360.com se mantienen. Cambiaron la forma, la jerarquía y el lugar que ocupa el buscador."
    >
      <div className={cn(boxed, "overflow-x-auto px-3 py-2")}>
        <table className="w-full min-w-[640px] border-collapse">
          <caption className="visually-hidden">Comparación entre el diseño anterior y el actual</caption>
          <thead>
            <tr>
              <th scope="col" className={cn(headCell, "text-subtle")}>
                Elemento
              </th>
              <th scope="col" className={cn(headCell, "text-subtle")}>
                Antes
              </th>
              <th scope="col" className={cn(headCell, "text-gold-text")}>
                Ahora
              </th>
            </tr>
          </thead>
          <tbody>
            {designChanges.map((change) => (
              <tr key={change.element}>
                <th scope="row" className={cn(bodyCell, "text-left font-semibold text-navy-900")}>
                  {change.element}
                </th>
                <td className={cn(bodyCell, "text-subtle")}>{change.before}</td>
                <td className={cn(bodyCell, "text-navy-900")}>{change.after}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DocSection>
  );
}

/** 02 · Paleta, proporción y pares de contraste. */
export function ColorSection() {
  return (
    <DocSection
      id="sec2"
      number="02"
      title="Color"
      description="Mucho ivory y blanco, navy para el texto y las superficies que anclan la página, y dorado solo donde está la acción."
    >
      <ul className="m-0 grid list-none grid-cols-[repeat(auto-fit,minmax(min(200px,100%),1fr))] gap-3 p-0">
        {palette.map((color) => (
          <li
            key={color.name}
            className="flex flex-col overflow-hidden rounded-tile border border-[rgba(11,27,51,0.07)] bg-white"
          >
            <span aria-hidden="true" className={cn("h-[88px] border-b border-[rgba(11,27,51,0.06)]", color.swatchClass)} />
            <span className="flex flex-col gap-1 px-4 pt-3.5 pb-4">
              <span className="text-[15px] font-semibold text-navy-900">{color.name}</span>
              <span className="text-xs font-semibold text-subtle tabular-nums">{color.hex}</span>
              <span className="text-[13px] leading-[1.45] text-ink">{color.use}</span>
            </span>
          </li>
        ))}
      </ul>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(380px,100%),1fr))] gap-3">
        <Card className="flex flex-col gap-4">
          <span className={eyebrow}>Proporción sugerida por pantalla</span>
          <div
            role="img"
            aria-label="Claros 70 por ciento, navy 22 por ciento, dorado 8 por ciento"
            className="flex h-11 overflow-hidden rounded-[14px] border border-[rgba(11,27,51,0.08)]"
          >
            <span className="flex-[70] bg-ivory" />
            <span className="flex-[22] bg-navy-900" />
            <span className="flex-[8] bg-gold-500" />
          </div>
          <div className="flex flex-wrap gap-x-5 gap-y-1.5 text-[13px] text-ink">
            <span>
              <strong className="text-navy-900">70 %</strong> ivory y blanco
            </span>
            <span>
              <strong className="text-navy-900">22 %</strong> navy
            </span>
            <span>
              <strong className="text-navy-900">8 %</strong> dorado
            </span>
          </div>
          <p className={note}>Una sola acción dorada por vista: si todo es dorado, nada se ve como el siguiente paso.</p>
        </Card>

        <Card className="flex flex-col gap-4">
          <span className={eyebrow}>Pares de contraste (WCAG)</span>
          <ul className="m-0 grid list-none grid-cols-[repeat(auto-fit,minmax(min(230px,100%),1fr))] gap-2 p-0">
            {contrastPairs.map((pair) => (
              <li
                key={pair.label}
                className={cn(
                  "flex items-center justify-between gap-2 rounded-[14px] border border-[rgba(11,27,51,0.08)] px-3 py-2.5",
                  pair.className,
                )}
              >
                <span className="text-sm font-semibold">{pair.label}</span>
                <span className="shrink-0 text-xs font-semibold whitespace-nowrap tabular-nums">{pair.ratio}</span>
              </li>
            ))}
          </ul>
          <p className={note}>Todos superan 4,5 : 1 para texto normal. El dorado 500 no se usa como color de texto sobre claro.</p>
        </Card>
      </div>
    </DocSection>
  );
}

/** 03 · Escala tipográfica. */
export function TypographySection() {
  return (
    <DocSection
      id="sec3"
      number="03"
      title="Tipografía"
      description="Montserrat para lo que se lee de lejos, Inter para todo lo demás. Pesos altos en títulos cortos; nada en mayúsculas sostenidas."
    >
      <div className={cn(boxed, "flex flex-col px-7 py-2")}>
        {typeScale.map((style) => (
          <div key={style.name} className="flex flex-wrap items-baseline gap-x-8 gap-y-2.5 border-t border-line py-5">
            <span className="flex-[0_0_240px] text-xs font-semibold text-subtle tabular-nums">
              {style.name}
              <br />
              {style.spec}
            </span>
            <p className={cn("m-0 min-w-0 flex-[1_1_320px] wrap-anywhere", style.sampleClass)}>{style.sample}</p>
          </div>
        ))}
      </div>
    </DocSection>
  );
}

/** 04 · Radios, espaciado y niveles de sombra. */
export function ShapeSection() {
  return (
    <DocSection
      id="sec4"
      number="04"
      title="Forma, espacio y profundidad"
      description="Radios generosos que crecen con el tamaño del bloque, espaciado en múltiplos de 4 y tres niveles de sombra."
    >
      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(560px,100%),1fr))] gap-3">
        <Card className="flex flex-col gap-4">
          <span className={eyebrow}>Radios</span>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(140px,1fr))] gap-5">
            {radii.map((radius) => (
              <div key={radius.label} className="flex flex-col items-start gap-2.5">
                <span
                  aria-hidden="true"
                  className={cn("h-[72px] w-24 border-[1.5px] border-navy-900 bg-cream", radius.className)}
                />
                <span className="text-sm font-semibold text-navy-900">{radius.label}</span>
                <span className="text-[13px] leading-[1.4] text-subtle">{radius.use}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="flex flex-col gap-4">
          <span className={eyebrow}>Espaciado (px)</span>
          <div className="flex flex-wrap items-end gap-4">
            {spacingScale.map((step) => (
              <div key={step.value} className="flex flex-col items-start gap-2">
                <span aria-hidden="true" className={cn("h-7 rounded-md bg-gold-500", step.widthClass)} />
                <span className="text-xs font-semibold text-subtle tabular-nums">{step.value}</span>
              </div>
            ))}
          </div>
          <p className={note}>24 entre bloques de una tarjeta, 16 entre tarjetas, 40 entre título y contenido, 96 entre secciones.</p>
        </Card>
      </div>

      <Card className="flex flex-col gap-4">
        <span className={eyebrow}>Profundidad</span>
        <div className="flex flex-wrap gap-6 px-1 pt-2 pb-1">
          {depthLevels.map((level) => (
            <div key={level.label} className="flex min-w-0 flex-[1_1_200px] flex-col gap-3">
              <div aria-hidden="true" className={cn("h-24 rounded-panel bg-white", level.className)} />
              <span className="text-sm font-semibold text-navy-900">{level.label}</span>
              <span className="text-[13px] leading-[1.45] text-subtle">{level.use}</span>
            </div>
          ))}
        </div>
      </Card>
    </DocSection>
  );
}
