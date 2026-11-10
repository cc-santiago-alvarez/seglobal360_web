import { DocSection } from "./DocSection";
import { principles } from "./fixtures";

/** 07 · Reglas para decidir una pantalla nueva. */
export function PrinciplesSection() {
  return (
    <DocSection
      id="sec7"
      number="07"
      title="Principios"
      description="Cinco reglas para decidir cuando una pantalla nueva no encaje en lo anterior."
    >
      <ol className="m-0 grid list-none grid-cols-[repeat(auto-fit,minmax(min(220px,100%),1fr))] gap-3 p-0">
        {principles.map((principle) => (
          <li
            key={principle.number}
            className="flex flex-col gap-2 rounded-panel border border-[rgba(11,27,51,0.07)] bg-white p-[22px]"
          >
            <span className="font-display text-[28px] leading-none font-bold text-gold-500">{principle.number}</span>
            <span className="font-display text-[17px] leading-[1.3] font-bold text-navy-900">{principle.title}</span>
            <span className="text-sm leading-normal text-ink">{principle.text}</span>
          </li>
        ))}
      </ol>
    </DocSection>
  );
}
