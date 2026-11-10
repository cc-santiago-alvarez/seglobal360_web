import { cn } from "@/shared/lib/cn";
import { FaqList } from "./FaqList";
import { faqs } from "./fixtures";
import { container, eyebrow, sectionLead, sectionTitle } from "./styles";

/** Preguntas frecuentes: título a la izquierda y acordeón a la derecha. */
export function Faq() {
  return (
    <section id="preguntas" aria-labelledby="preguntas-titulo" className="pb-24">
      <div className={cn(container, "flex flex-wrap items-start gap-x-10 gap-y-8")}>
        <div className="flex flex-[1_1_280px] flex-col gap-3.5">
          <span className={eyebrow}>Antes de escribirnos</span>
          <h2 id="preguntas-titulo" className={sectionTitle}>
            Preguntas frecuentes
          </h2>
          <p className={sectionLead}>Si no encuentras tu respuesta, escríbenos por WhatsApp.</p>
        </div>
        <FaqList faqs={faqs} />
      </div>
    </section>
  );
}
