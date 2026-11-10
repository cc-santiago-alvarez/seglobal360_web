"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { Mail } from "lucide-react";
import { cn } from "@/shared/lib/cn";
import { Panel } from "@/shared/ui/Card";
import { Field, Select, TextInput } from "@/shared/ui/Field";
import type { CountryCode } from "@/shared/ui/Flag";
import type { CurrencyOption, RegisterCompanyType, RegisterCountry, RegisterTypeOption } from "./fixtures";

type Props = {
  initialType: RegisterCompanyType;
  types: RegisterTypeOption[];
  countries: RegisterCountry[];
  /** Moneda que se ofrece además de la local. */
  extraCurrency: CurrencyOption;
  /** Etiquetas de los cuatro pasos: empresa, tus datos, cuenta y verificación. */
  steps: string[];
};

const lastStep = 4;
const gridWide = "grid grid-cols-[repeat(auto-fit,minmax(min(300px,100%),1fr))] gap-x-5 gap-y-[18px]";
const gridNarrow = "grid grid-cols-[repeat(auto-fit,minmax(min(200px,100%),1fr))] gap-x-5 gap-y-[18px]";
const stepTitle = "font-display text-[18px] leading-[normal] font-bold tracking-[-0.02em]";

/** Asistente de registro en cuatro pasos; los datos se conservan al volver atrás. */
export function RegisterWizard({ initialType, types, countries, extraCurrency, steps }: Props) {
  const [step, setStep] = useState(1);
  const [typeId, setTypeId] = useState<RegisterCompanyType>(initialType);
  const [countryCode, setCountryCode] = useState<CountryCode | undefined>(countries[0]?.code);
  const [resent, setResent] = useState(false);
  const stepsRef = useRef<HTMLOListElement>(null);
  const navigated = useRef(false);

  // Tras cambiar de paso, el foco vuelve a la lista de pasos.
  useEffect(() => {
    if (navigated.current) stepsRef.current?.focus();
  }, [step]);

  const country = countries.find((item) => item.code === countryCode) ?? countries[0];
  const type = types.find((item) => item.id === typeId) ?? types[0];
  if (!country || !type) return null;

  const goTo = (next: number) => {
    navigated.current = true;
    setStep(Math.min(lastStep, Math.max(1, next)));
  };

  // Demo sin backend: cada envío avanza un paso; «Crear cuenta» lleva a la verificación.
  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    goTo(step + 1);
  };

  return (
    <>
      <ol
        ref={stepsRef}
        tabIndex={-1}
        aria-label="Pasos del registro"
        className="mt-8 grid grid-cols-[repeat(auto-fit,minmax(min(150px,100%),1fr))] gap-3 focus:outline-none"
      >
        {steps.map((label, index) => {
          const n = index + 1;
          const done = n < step;
          const current = n === step;
          return (
            <li
              key={label}
              aria-current={current ? "step" : undefined}
              className={cn(
                "flex items-center gap-2.5 rounded-btn border px-3.5 py-3",
                current ? "border-gold-500 bg-white" : "border-line-warm",
              )}
            >
              <span
                aria-hidden="true"
                className={cn(
                  "grid size-7 shrink-0 place-items-center rounded-full font-display text-xs font-bold",
                  done ? "bg-success-fg text-white" : current ? "bg-gold-500 text-navy-950" : "bg-surface-muted text-subtle",
                )}
              >
                {done ? "✓" : String(n).padStart(2, "0")}
              </span>
              <span className={cn("text-sm font-semibold", n > step ? "text-subtle" : "text-navy-900")}>
                {label}
                {done ? <span className="visually-hidden"> (completado)</span> : null}
              </span>
            </li>
          );
        })}
      </ol>

      <Panel className="mt-6 p-8">
        <form noValidate onSubmit={onSubmit} className="flex flex-col gap-6">
          <div hidden={step !== 1} className="flex flex-col gap-6">
            <fieldset>
              <legend className="font-display text-[18px] leading-[normal] font-semibold">
                ¿Qué hará tu empresa en SEGlobal 360?
              </legend>
              <div className="mt-3.5 grid grid-cols-[repeat(auto-fit,minmax(min(200px,100%),1fr))] gap-3">
                {types.map((item) => {
                  const active = item.id === type.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      aria-pressed={active}
                      onClick={() => setTypeId(item.id)}
                      className={cn(
                        "flex flex-col gap-1.5 rounded-tile border-2 p-[18px] text-left text-navy-900",
                        active ? "border-gold-500 bg-selected" : "border-line-warm bg-white",
                      )}
                    >
                      <span className="font-display text-[16px] font-semibold">{item.title}</span>
                      <span className="text-[13px] leading-normal text-subtle">{item.description}</span>
                    </button>
                  );
                })}
              </div>
            </fieldset>

            <div className={gridWide}>
              <Field label="Razón social">
                <TextInput type="text" name="company.legalName" placeholder="Distribuidora Andina S.A.S." />
              </Field>
              <Field label="Nombre comercial" optional>
                <TextInput type="text" name="company.tradeName" />
              </Field>
            </div>

            <fieldset>
              <legend className="pb-2 text-[13px] font-semibold">País de la empresa</legend>
              <div role="group" className="inline-flex gap-1 rounded-tile bg-cream p-1">
                {countries.map((item) => {
                  const active = item.code === country.code;
                  return (
                    <button
                      key={item.code}
                      type="button"
                      aria-pressed={active}
                      onClick={() => setCountryCode(item.code)}
                      className={cn(
                        "min-h-10 rounded-field px-5 text-sm font-semibold",
                        active ? "bg-white text-navy-900" : "bg-transparent text-subtle",
                      )}
                    >
                      {item.name}
                    </button>
                  );
                })}
              </div>
            </fieldset>

            <div className={gridNarrow}>
              <Field label="Tipo de documento">
                <Select name="company.documentTypeCode">
                  <option key={country.companyDocument.code} value={country.companyDocument.code}>
                    {country.companyDocument.name}
                  </option>
                </Select>
              </Field>
              <Field label="Número de documento">
                <TextInput type="text" name="company.documentNumber" placeholder={country.companyDocumentPlaceholder} />
              </Field>
              <Field label="Moneda de facturación">
                <Select name="company.billingCurrency">
                  <option key={country.currency.code} value={country.currency.code}>
                    {country.currency.label}
                  </option>
                  <option key={extraCurrency.code} value={extraCurrency.code}>
                    {extraCurrency.label}
                  </option>
                </Select>
              </Field>
            </div>
            <div className={gridWide}>
              <Field label="Correo de contacto de la empresa">
                <TextInput type="email" name="company.contactEmail" />
              </Field>
              <Field label="Teléfono de contacto">
                <TextInput type="tel" name="company.contactPhone" placeholder={country.phonePlaceholder} />
              </Field>
            </div>
          </div>

          <div hidden={step !== 2} className="flex flex-col gap-5">
            <div>
              <h2 className={stepTitle}>Tus datos</h2>
              <p className="mt-1.5 text-sm text-subtle">
                Eres el primer usuario de la empresa y quedas como su administrador.
              </p>
            </div>
            <div className={gridWide}>
              <Field label="Nombres">
                <TextInput type="text" name="person.firstName" autoComplete="given-name" />
              </Field>
              <Field label="Apellidos">
                <TextInput type="text" name="person.lastName" autoComplete="family-name" />
              </Field>
            </div>
            <div className={gridNarrow}>
              <Field label="País del documento">
                <Select name="person.documentCountry">
                  <option key={country.code} value={country.code}>
                    {country.name}
                  </option>
                </Select>
              </Field>
              <Field label="Tipo de documento">
                <Select name="person.documentTypeCode">
                  {country.personDocuments.map((document) => (
                    <option key={document.code} value={document.code}>
                      {document.name}
                    </option>
                  ))}
                </Select>
              </Field>
              <Field label="Número">
                <TextInput type="text" name="person.documentNumber" />
              </Field>
            </div>
            <Field label="Teléfono" optional className="max-w-[360px]">
              <TextInput type="tel" name="person.phone" placeholder={country.phonePlaceholder} />
            </Field>
          </div>

          <div hidden={step !== 3} className="flex flex-col gap-5">
            <div>
              <h2 className={stepTitle}>Tu cuenta</h2>
              <p className="mt-1.5 text-sm text-subtle">
                Con este correo vas a ingresar. Te enviaremos un enlace para verificarlo.
              </p>
            </div>
            <Field label="Correo electrónico" className="max-w-[480px]">
              <TextInput type="email" name="account.email" autoComplete="email" placeholder="nombre@empresa.com" />
            </Field>
            <Field
              label="Contraseña"
              className="max-w-[480px]"
              hint="Entre 12 y 128 caracteres. Una frase larga es más segura que una palabra con símbolos."
              hintId="register-password-help"
            >
              <TextInput
                type="password"
                name="account.password"
                autoComplete="new-password"
                aria-describedby="register-password-help"
              />
            </Field>
          </div>

          {step === lastStep ? (
            <div className="flex flex-col items-start gap-[18px]">
              <span className="grid size-14 place-items-center rounded-full bg-success-bg text-success-fg">
                <Mail size={26} strokeWidth={2} aria-hidden="true" />
              </span>
              <h2 className="font-display text-[24px] leading-[normal] font-bold tracking-[-0.02em]">Revisa tu correo</h2>
              <p className="max-w-[560px] text-[15px] leading-[1.6] text-ink">
                Te enviamos un enlace para verificar tu cuenta. Mientras tanto, esto es lo que sigue:
              </p>
              <ol className="list-decimal pl-5 text-[15px] leading-[1.8] text-ink">
                <li>Verificas tu correo con el enlace.</li>
                <li>Operaciones valida tu empresa y te avisa por correo.</li>
                {type.reviewsProfile ? <li>Completas tu perfil y lo envías a revisión.</li> : null}
                <li>{type.finalStep}</li>
              </ol>
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => setResent(true)}
                  className="py-2 text-sm font-semibold text-gold-text underline"
                >
                  Reenviar el correo de verificación
                </button>
                <span role="status" className="text-sm text-subtle">
                  {resent ? "Listo, te enviamos un correo nuevo." : null}
                </span>
              </div>
            </div>
          ) : (
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line pt-5">
              <button
                type="button"
                onClick={() => goTo(step - 1)}
                disabled={step === 1}
                className="min-h-12 rounded-btn border border-line-strong bg-white px-[22px] text-sm font-semibold text-navy-900 disabled:cursor-not-allowed disabled:text-faint"
              >
                Atrás
              </button>
              <button
                type="submit"
                className="lift min-h-12 rounded-btn bg-navy-900 px-[26px] text-[15px] font-semibold text-white"
              >
                {step === lastStep - 1 ? "Crear cuenta" : "Continuar"}
              </button>
            </div>
          )}
        </form>
      </Panel>
    </>
  );
}
