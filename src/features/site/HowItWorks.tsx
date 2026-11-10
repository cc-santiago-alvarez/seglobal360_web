import { cn } from "@/shared/lib/cn";
import { howItWorksSteps } from "./fixtures";
import { cardText, cardTitle, container, sectionLead, sectionTitle } from "./styles";

/** Cómo funciona: los tres pasos para cotizar. */
export function HowItWorks() {
  return (
    <section id="como" aria-labelledby="como-titulo" className="border-y border-[rgba(11,27,51,0.06)] bg-white py-24">
      <div className={cn(container, "flex flex-col gap-10")}>
        <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-4">
          <h2 id="como-titulo" className={cn(sectionTitle, "max-w-[640px]")}>
            Tres pasos. Tú decides en cada uno.
          </h2>
          <p className={cn(sectionLead, "max-w-[420px]")}>
            Para cotizar en línea necesitas una cuenta de empresa validada por Global 360. El registro toma unos
            minutos.
          </p>
        </div>
        <ol className="m-0 grid list-none grid-cols-[repeat(auto-fit,minmax(min(300px,100%),1fr))] gap-4 p-0">
          {howItWorksSteps.map((step) => (
            <li key={step.number} className="flex flex-col gap-3.5 rounded-card bg-ivory p-7">
              <span className="font-display text-[56px] leading-none font-bold text-gold-500">{step.number}</span>
              <h3 className={cardTitle}>{step.title}</h3>
              <p className={cardText}>{step.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
