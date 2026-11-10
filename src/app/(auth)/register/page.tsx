import { registerCountries, registerSteps, registerTypes, usdCurrency } from "@/features/access/fixtures";
import { RegisterHeader } from "@/features/access/RegisterHeader";
import { parseRegisterType } from "@/features/access/registerType";
import { RegisterWizard } from "@/features/access/RegisterWizard";
import { Eyebrow } from "@/shared/ui/Card";

export const metadata = { title: "Registrar empresa" };

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { type } = await searchParams;
  const initialType = parseRegisterType(type);

  return (
    <div className="min-h-screen bg-ivory text-navy-900">
      <RegisterHeader />
      <main className="mx-auto max-w-[820px] px-6 pt-12 pb-20">
        <Eyebrow>Registro de empresa</Eyebrow>
        <h1 className="mt-3 font-display text-[36px] leading-[1.15] font-bold tracking-[-0.02em]">
          Crea la cuenta de tu empresa
        </h1>
        <p className="mt-3 text-base leading-[1.6] text-subtle">
          Tú serás el administrador. Operaciones valida la empresa antes de que pueda pedir cotizaciones o publicar
          servicios.
        </p>
        <RegisterWizard
          key={initialType}
          initialType={initialType}
          types={registerTypes}
          countries={registerCountries}
          extraCurrency={usdCurrency}
          steps={registerSteps}
        />
      </main>
    </div>
  );
}
