/** Encabezado de portal con el estado junto al título (fuera del `<h1>`), descripción y acciones. */
export function StatusHeader({
  title,
  status,
  description,
  actions,
}: {
  title: string;
  status: React.ReactNode;
  description: React.ReactNode;
  actions?: React.ReactNode;
}) {
  return (
    <header className="flex flex-wrap items-center justify-between gap-4 px-10 pt-7 max-[600px]:px-4">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="m-0 font-display text-[30px] font-bold tracking-[-0.02em]">{title}</h1>
          {status}
        </div>
        <p className="mt-2 mb-0 text-[15px] text-subtle">{description}</p>
      </div>
      {actions ? <div className="flex flex-wrap gap-2.5">{actions}</div> : null}
    </header>
  );
}
