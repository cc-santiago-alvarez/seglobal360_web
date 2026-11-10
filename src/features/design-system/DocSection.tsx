/** Sección numerada de la guía: número, título, descripción a la derecha y contenido. */
export function DocSection({
  id,
  number,
  title,
  description,
  children,
}: {
  id: string;
  number: string;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section aria-labelledby={id} className="flex flex-col gap-5">
      <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-2">
        <div className="flex flex-col gap-2">
          <span className="text-[13px] font-semibold tracking-[0.02em] text-gold-text">{number}</span>
          <h2 id={id} className="m-0 font-display text-[32px] leading-[1.15] font-bold tracking-[-0.02em] text-navy-900">
            {title}
          </h2>
        </div>
        <p className="m-0 max-w-[520px] text-sm leading-normal text-subtle">{description}</p>
      </div>
      {children}
    </section>
  );
}
