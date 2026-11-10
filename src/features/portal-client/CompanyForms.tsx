"use client";

import { X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/shared/lib/cn";
import { Field, inputClass, Select, TextArea, TextInput } from "@/shared/ui/Field";
import { currencies, maxMainProducts, type ClientCompany } from "./fixtures";
import { autoGrid, panelTitle, portalButton } from "./ui";

const formClass = "flex flex-col gap-[18px] rounded-panel border border-[#E9E6DE] bg-white px-[26px] py-6";

/** Mensaje de guardado y botón de envío al pie de un formulario editable. */
function SaveRow({ saved, label }: { saved: boolean; label: string }) {
  return (
    <div className="flex items-center justify-end gap-3">
      {saved ? (
        <span role="status" className="text-sm font-medium text-success-fg">
          Cambios guardados.
        </span>
      ) : null}
      <button type="submit" className={portalButton("navy", 46, { padding: "px-[22px]!" })}>
        {label}
      </button>
    </div>
  );
}

type FormProps = { company: ClientCompany; canEdit: boolean };

/** Formulario de contacto y facturación de la empresa. */
export function CompanyContactForm({ company, canEdit }: FormProps) {
  const [saved, setSaved] = useState(false);

  return (
    <form
      aria-labelledby="contacto-titulo"
      onSubmit={(event) => {
        event.preventDefault();
        setSaved(true);
      }}
      onChange={() => setSaved(false)}
      className={formClass}
    >
      <h2 id="contacto-titulo" className={panelTitle}>
        Contacto y facturación
      </h2>
      <fieldset disabled={!canEdit} className={cn(autoGrid[260], "m-0 min-w-0 gap-x-5 gap-y-[18px] border-0 p-0")}>
        <Field label="Nombre comercial" optional>
          <TextInput name="tradeName" defaultValue={company.tradeName} />
        </Field>
        <Field label="Moneda de facturación">
          <Select name="billingCurrency" defaultValue={company.billingCurrency}>
            {currencies.map((currency) => (
              <option key={currency.code} value={currency.code}>
                {currency.code} · {currency.name}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Correo de contacto">
          <TextInput type="email" name="contactEmail" defaultValue={company.contactEmail} />
        </Field>
        <Field label="Teléfono de contacto">
          <TextInput type="tel" name="contactPhone" defaultValue={company.contactPhone} />
        </Field>
      </fieldset>
      {canEdit ? <SaveRow saved={saved} label="Guardar cambios" /> : null}
    </form>
  );
}

/** Formulario del perfil comercial, con los productos principales como etiquetas. */
export function CompanyProfileForm({ company, canEdit }: FormProps) {
  const [saved, setSaved] = useState(false);
  const [products, setProducts] = useState(company.profile.mainProducts);
  const [draft, setDraft] = useState("");

  const addProduct = () => {
    const name = draft.trim();
    if (name === "" || products.length >= maxMainProducts) return;
    if (!products.some((product) => product.toLowerCase() === name.toLowerCase())) {
      setProducts([...products, name]);
      setSaved(false);
    }
    setDraft("");
  };

  const removeProduct = (name: string) => {
    setProducts(products.filter((product) => product !== name));
    setSaved(false);
  };

  return (
    <form
      aria-labelledby="perfil-titulo"
      onSubmit={(event) => {
        event.preventDefault();
        setSaved(true);
      }}
      onChange={() => setSaved(false)}
      className={formClass}
    >
      <div>
        <h2 id="perfil-titulo" className={panelTitle}>
          Perfil comercial
        </h2>
        <p className="mt-1.5 mb-0 text-sm text-subtle">Ayuda a tu asesor a entender tu operación antes de cotizar.</p>
      </div>
      <fieldset disabled={!canEdit} className="m-0 flex min-w-0 flex-col gap-[18px] border-0 p-0">
        <div className={cn(autoGrid[220], "gap-x-5 gap-y-[18px]")}>
          <Field label="Industria">
            <TextInput name="industry" defaultValue={company.profile.industry} />
          </Field>
          <Field label="Sitio web">
            <TextInput type="url" name="website" defaultValue={company.profile.website} />
          </Field>
          <label className="flex min-w-0 flex-col gap-2">
            <span className="text-[13px] font-semibold">Envíos estimados al mes</span>
            <input
              type="number"
              name="monthlyShipments"
              min={1}
              required
              defaultValue={company.profile.monthlyShipments}
              aria-describedby="envios-ayuda"
              className={inputClass}
            />
            <span id="envios-ayuda" className="text-xs text-subtle">
              Una vez informado, no se puede dejar vacío.
            </span>
          </label>
        </div>
        <Field label="Descripción">
          <TextArea
            name="description"
            rows={3}
            defaultValue={company.profile.description}
            className="min-h-0! resize-y"
          />
        </Field>
        <div className="flex flex-col gap-2">
          <label htmlFor="productos" className="text-[13px] font-semibold">
            Productos principales
          </label>
          <div
            className={cn(
              "flex min-h-12 flex-wrap gap-1.5 rounded-field border border-line-strong p-2 has-[input:focus-visible]:outline-2 has-[input:focus-visible]:outline-offset-2 has-[input:focus-visible]:outline-gold-500",
              canEdit ? "bg-white" : "bg-ivory",
            )}
          >
            {products.map((product) => (
              <span
                key={product}
                className="inline-flex items-center gap-1 rounded-full bg-[#F3F1EB] py-1 pr-1.5 pl-2.5 text-[13px] font-medium"
              >
                {product}
                <input type="hidden" name="mainProducts" value={product} />
                <button
                  type="button"
                  aria-label={`Quitar ${product}`}
                  onClick={() => removeProduct(product)}
                  className="grid size-6 place-items-center rounded-full border-0 bg-transparent text-subtle"
                >
                  <X size={12} strokeWidth={2.5} aria-hidden="true" />
                </button>
              </span>
            ))}
            <input
              id="productos"
              type="text"
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  addProduct();
                }
              }}
              placeholder="Agregar…"
              aria-describedby="productos-ayuda"
              className="min-w-20 flex-[1_1_100px] border-0 bg-transparent font-sans text-sm font-medium text-navy-900 focus-visible:outline-none"
            />
          </div>
          <span id="productos-ayuda" className="text-xs text-subtle">
            Hasta {maxMainProducts} productos.
          </span>
        </div>
      </fieldset>
      {canEdit ? <SaveRow saved={saved} label="Guardar perfil" /> : null}
    </form>
  );
}
