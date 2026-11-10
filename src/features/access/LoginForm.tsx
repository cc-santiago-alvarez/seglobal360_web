"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { CircleAlert, Eye, EyeOff, Mail } from "lucide-react";
import { routes } from "@/shared/lib/routes";
import { Field, TextInput } from "@/shared/ui/Field";
import { findDemoAccount } from "./fixtures";

/** Formulario de ingreso con mostrar u ocultar contraseña y el aviso de correo sin verificar. */
export function LoginForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [resent, setResent] = useState(false);
  const [failed, setFailed] = useState(false);

  // Demo sin backend: cada cuenta de demostración entra a su portal; el resto, el mismo error.
  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const account = findDemoAccount(String(data.get("email") ?? ""), String(data.get("password") ?? ""));
    if (!account) {
      setFailed(true);
      return;
    }
    router.push(account.home);
  };

  return (
    <>
      <form onSubmit={onSubmit} className="mt-8 flex flex-col gap-5">
        <Field label="Correo electrónico">
          <TextInput
            type="email"
            name="email"
            autoComplete="email"
            placeholder="nombre@empresa.com"
            aria-describedby={failed ? "login-error" : undefined}
          />
        </Field>
        <div className="flex flex-col gap-2">
          <div className="flex items-baseline justify-between gap-3">
            <label htmlFor="login-password" className="text-[13px] font-semibold">
              Contraseña
            </label>
            <Link href={routes.forgotPassword} className="text-[13px] font-semibold">
              ¿Olvidaste tu contraseña?
            </Link>
          </div>
          <div className="flex min-h-12 items-center rounded-field border border-line-strong bg-white pr-1 has-[input:focus-visible]:outline-2 has-[input:focus-visible]:outline-offset-2 has-[input:focus-visible]:outline-gold-500">
            <input
              id="login-password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              aria-describedby={failed ? "login-error" : undefined}
              className="h-[46px] min-w-0 flex-auto rounded-field bg-transparent px-3.5 text-[15px] font-medium text-navy-900 outline-none"
            />
            <button
              type="button"
              aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
              onClick={() => setShowPassword((shown) => !shown)}
              className="grid size-11 shrink-0 place-items-center text-subtle"
            >
              {showPassword ? (
                <EyeOff size={18} strokeWidth={1.75} aria-hidden="true" />
              ) : (
                <Eye size={18} strokeWidth={1.75} aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
        {failed ? (
          <p
            id="login-error"
            role="alert"
            className="m-0 flex items-start gap-2.5 rounded-btn bg-danger-bg px-4 py-3 text-sm leading-normal font-medium text-danger-fg"
          >
            <CircleAlert size={18} strokeWidth={1.75} aria-hidden="true" className="mt-px shrink-0" />
            Correo o contraseña incorrectos.
          </p>
        ) : null}
        <button
          type="submit"
          className="lift flex min-h-[52px] items-center justify-center rounded-btn bg-navy-900 text-[15px] font-semibold text-white"
        >
          Ingresar
        </button>
      </form>
      <div
        role="status"
        className="mt-5 flex items-start gap-3 rounded-btn bg-sand px-4 py-3.5 text-sm leading-normal text-warn-ink"
      >
        <Mail size={18} strokeWidth={1.75} aria-hidden="true" className="mt-0.5 shrink-0" />
        <span>
          Aún no verificas tu correo. Revisa tu bandeja de entrada o{" "}
          <button type="button" onClick={() => setResent(true)} className="text-sm font-semibold text-warn-ink underline">
            reenvía el enlace
          </button>
          .{resent ? <span className="mt-1 block font-semibold">Listo, te enviamos un enlace nuevo.</span> : null}
        </span>
      </div>
    </>
  );
}
