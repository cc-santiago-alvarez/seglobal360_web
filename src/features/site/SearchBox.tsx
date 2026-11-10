import type { ComponentProps } from "react";
import { Search } from "lucide-react";

type Props = Omit<ComponentProps<"input">, "type" | "className"> & {
  /** Nombre accesible del campo. */
  label: string;
  /** Botón o enlace a la derecha del campo. */
  action: React.ReactNode;
};

/** Campo de búsqueda grande sobre ivory, con la lupa y la acción a los lados. */
export function SearchBox({ label, action, ...input }: Props) {
  return (
    <div className="flex min-h-16 items-center gap-2.5 rounded-tile bg-ivory py-1.5 pr-1.5 pl-4 text-subtle has-[input:focus-visible]:outline-2 has-[input:focus-visible]:outline-offset-2 has-[input:focus-visible]:outline-gold-500">
      <Search size={20} strokeWidth={2} aria-hidden="true" className="shrink-0" />
      <label className="flex min-w-0 flex-auto">
        <span className="visually-hidden">{label}</span>
        <input
          type="search"
          className="min-h-11 w-full min-w-0 flex-auto border-0 bg-transparent font-sans text-[17px] font-medium text-navy-900 outline-none placeholder:text-faint"
          {...input}
        />
      </label>
      {action}
    </div>
  );
}
