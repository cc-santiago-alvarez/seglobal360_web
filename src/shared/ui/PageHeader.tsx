import { cn } from "@/shared/lib/cn";

type Props = {
  title: React.ReactNode;
  description?: React.ReactNode;
  /** Etiqueta o migas encima del título. */
  eyebrow?: React.ReactNode;
  /** Acciones a la derecha del título. */
  actions?: React.ReactNode;
  className?: string;
};

/** Encabezado de una pantalla de portal: título de 30 px en Montserrat y descripción. */
export function PageHeader({ title, description, eyebrow, actions, className }: Props) {
  return (
    <header className={cn("px-10 pt-7 max-[600px]:px-4", className)}>
      <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-4">
        <div className="min-w-0">
          {eyebrow ? <div className="mb-2 text-[13px] font-semibold text-gold-text">{eyebrow}</div> : null}
          <h1 className="m-0 font-display text-[30px] font-bold tracking-[-0.02em]">{title}</h1>
          {description ? <p className="mt-2 mb-0 text-[15px] text-subtle">{description}</p> : null}
        </div>
        {actions ? <div className="flex flex-wrap items-center gap-2.5">{actions}</div> : null}
      </div>
    </header>
  );
}

/** Contenido de una pantalla de portal, con los márgenes del diseño. */
export function PageBody({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <main className={cn("flex flex-col gap-5 px-10 pt-6 pb-14 max-[600px]:px-4", className)}>{children}</main>
  );
}
