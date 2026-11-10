import { Breadcrumb } from "./Breadcrumb";
import type { StartingService } from "./fixtures";
import { NewInquiryForm } from "./NewInquiryForm";
import { headerClass } from "./ui";

/** Pantalla de nueva solicitud: migas, título y formulario con su resumen. */
export function NewInquiry({ startingService }: { startingService: StartingService | null }) {
  return (
    <>
      <header className={headerClass}>
        <Breadcrumb current="Nueva solicitud" />
        <h1 className="mt-2.5 mb-0 font-display text-[30px] font-bold tracking-[-0.02em]">Nueva solicitud de cotización</h1>
        <p className="mt-2 mb-0 text-[15px] text-subtle">
          Cuéntanos qué necesitas mover. Mientras más completa, más rápido te cotizamos.
        </p>
      </header>
      <NewInquiryForm startingService={startingService} />
    </>
  );
}
