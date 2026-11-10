import { Card } from "@/shared/ui/Card";
import { StatusPill } from "@/shared/ui/StatusPill";
import { apiStateGroups } from "./apiStates";
import { DocSection } from "./DocSection";

/** 06 · Etiqueta, tono y valor del backend de cada estado. */
export function ApiStatesSection() {
  return (
    <DocSection
      id="sec6"
      number="06"
      title="Estados de la API"
      description="Cada etiqueta corresponde a un valor del backend. El color agrupa el significado y el texto siempre lo acompaña."
    >
      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(400px,100%),1fr))] gap-3">
        {apiStateGroups.map((group) => (
          <Card key={group.title} className="flex flex-col gap-3">
            <span className="text-[15px] font-bold text-navy-900">{group.title}</span>
            <div className="flex flex-wrap gap-2">
              {group.items.map((item) => (
                <span key={item.value} className="inline-flex flex-col gap-1">
                  <StatusPill tone={item.tone} className="min-h-7">
                    {item.label}
                  </StatusPill>
                  <code className="pl-1 font-sans text-[11px] font-semibold text-faint tabular-nums">{item.value}</code>
                </span>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </DocSection>
  );
}
