"use client";

import { Check, UserPlus, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { userStatus, type UserStatus } from "@/features/user/model";
import { cn, initials } from "@/shared/lib/cn";
import { Panel } from "@/shared/ui/Card";
import { inputClass, selectClass, textareaClass } from "@/shared/ui/Field";
import { countryName } from "@/shared/ui/Flag";
import { StatusPill } from "@/shared/ui/StatusPill";
import { Table, Td, Th } from "@/shared/ui/Table";
import {
  companyRoles,
  personDocumentTypes,
  session,
  type CompanyRole,
  type CompanyUser,
} from "./fixtures";
import { autoGrid, headerClass, mainClass, panelTitle, portalButton } from "./ui";

const maxReason = 500;
const fieldClass = cn(inputClass, "min-h-[46px]!");
const fieldSelectClass = cn(selectClass, "min-h-[46px]!");

/** Acción principal de cada estado sobre otro usuario, y el estado al que lleva. */
const primaryAction: Partial<Record<UserStatus, { label: string; next: UserStatus }>> = {
  active: { label: "Desactivar", next: "inactive" },
  inactive: { label: "Activar", next: "active" },
  blocked: { label: "Desbloquear", next: "active" },
};

function roleName(role: CompanyRole): string {
  return companyRoles.find((item) => item.id === role)?.name ?? role;
}

function isRole(value: string): value is CompanyRole {
  return companyRoles.some((item) => item.id === value);
}

/** Etiqueta de un campo obligatorio, con el asterisco rojo del diseño. */
function RequiredLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-[13px] font-semibold">
      {children} <span className="text-danger-fg">*</span>
    </span>
  );
}

/** Usuarios de la empresa: invitación, rol, estado y bloqueo con motivo. */
export function CompanyUsers({ initialUsers }: { initialUsers: ReadonlyArray<CompanyUser> }) {
  const [users, setUsers] = useState<CompanyUser[]>([...initialUsers]);
  const [inviteOpen, setInviteOpen] = useState(true);
  const [inviteRole, setInviteRole] = useState<CompanyRole>("operator");
  const [sent, setSent] = useState(false);
  const [blocking, setBlocking] = useState<CompanyUser | null>(null);
  const [blockReason, setBlockReason] = useState("");
  const [blockError, setBlockError] = useState(false);
  const blockRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (blocking) blockRef.current?.focus();
  }, [blocking]);

  const updateUser = (id: string, change: Partial<CompanyUser>) => {
    setUsers((current) => current.map((user) => (user.id === id ? { ...user, ...change } : user)));
  };

  const sendInvite = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const firstName = String(data.get("firstName") ?? "").trim();
    const lastName = String(data.get("lastName") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    setUsers((current) => [
      ...current,
      {
        id: `invited-${current.length + 1}`,
        email,
        fullName: `${firstName} ${lastName}`.trim(),
        initials: initials(`${firstName} ${lastName}`),
        role: inviteRole,
        status: "pending_verification",
        lastLoginLabel: "—",
      },
    ]);
    setInviteOpen(false);
    setSent(true);
  };

  const startBlock = (user: CompanyUser) => {
    setBlocking(user);
    setBlockReason("");
    setBlockError(false);
  };

  const confirmBlock = () => {
    if (!blocking) return;
    if (blockReason.trim() === "") {
      setBlockError(true);
      blockRef.current?.focus();
      return;
    }
    updateUser(blocking.id, { status: "blocked" });
    setBlocking(null);
  };

  const showBlockError = blockError && blockReason.trim() === "";

  return (
    <>
      <header className={cn(headerClass, "flex flex-wrap items-center justify-between gap-4")}>
        <div>
          <h1 className="m-0 font-display text-[30px] font-bold tracking-[-0.02em]">Usuarios</h1>
          <p className="mt-2 mb-0 text-[15px] text-subtle">
            Las personas de tu empresa que usan SEGlobal 360 y lo que cada una puede hacer.
          </p>
        </div>
        {inviteOpen ? null : (
          <button
            type="button"
            onClick={() => {
              setInviteOpen(true);
              setSent(false);
            }}
            className={portalButton("gold", 44, { className: "gap-2!" })}
          >
            <UserPlus size={18} strokeWidth={2} aria-hidden="true" />
            Invitar usuario
          </button>
        )}
      </header>

      <main className={cn(mainClass, "flex flex-col gap-5")}>
        {sent ? (
          <div
            role="status"
            className="flex items-center gap-3 rounded-[14px] bg-success-bg px-[18px] py-3.5 text-sm font-medium text-[#154F2E]"
          >
            <Check size={18} strokeWidth={2} aria-hidden="true" className="shrink-0" />
            Invitación enviada. La persona recibirá un correo para crear su contraseña.
          </div>
        ) : null}

        {inviteOpen ? (
          <form
            aria-labelledby="invitar-titulo"
            onSubmit={sendInvite}
            className="flex flex-col gap-[18px] rounded-panel border border-gold-500 bg-white px-[26px] py-6 shadow-[0_0_0_4px_rgba(201,164,92,0.12)]"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 id="invitar-titulo" className={panelTitle}>
                  Invitar usuario
                </h2>
                <p className="mt-1.5 mb-0 text-sm text-subtle">
                  Le llegará un correo para aceptar la invitación y crear su contraseña.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setInviteOpen(false)}
                aria-label="Cerrar"
                className="grid size-11 shrink-0 place-items-center rounded-full border-0 bg-[#F3F1EB] text-navy-900"
              >
                <X size={18} strokeWidth={2} aria-hidden="true" />
              </button>
            </div>
            <div className={cn(autoGrid[220], "gap-x-5 gap-y-4")}>
              <label className="flex min-w-0 flex-col gap-2">
                <RequiredLabel>Nombres</RequiredLabel>
                <input type="text" name="firstName" required autoComplete="off" className={fieldClass} />
              </label>
              <label className="flex min-w-0 flex-col gap-2">
                <RequiredLabel>Apellidos</RequiredLabel>
                <input type="text" name="lastName" required autoComplete="off" className={fieldClass} />
              </label>
              <label className="flex min-w-0 flex-col gap-2">
                <RequiredLabel>Correo</RequiredLabel>
                <input
                  type="email"
                  name="email"
                  required
                  autoComplete="off"
                  placeholder="nombre@empresa.com"
                  className={fieldClass}
                />
              </label>
            </div>
            <div className={cn(autoGrid[200], "gap-x-5 gap-y-4")}>
              <label className="flex min-w-0 flex-col gap-2">
                <RequiredLabel>País del documento</RequiredLabel>
                <select name="documentCountry" defaultValue="CO" className={fieldSelectClass}>
                  <option value="CO">{countryName.CO}</option>
                  <option value="CR">{countryName.CR}</option>
                </select>
              </label>
              <label className="flex min-w-0 flex-col gap-2">
                <RequiredLabel>Tipo de documento</RequiredLabel>
                <select name="documentType" className={fieldSelectClass}>
                  {personDocumentTypes.map((type) => (
                    <option key={type}>{type}</option>
                  ))}
                </select>
              </label>
              <label className="flex min-w-0 flex-col gap-2">
                <RequiredLabel>Número</RequiredLabel>
                <input type="text" name="documentNumber" required autoComplete="off" className={fieldClass} />
              </label>
            </div>
            <fieldset className="m-0 min-w-0 border-0 p-0">
              <legend className="pb-2.5 text-[13px] font-semibold">
                Rol <span className="text-danger-fg">*</span>
              </legend>
              <div className={cn(autoGrid[260], "gap-3")}>
                {companyRoles.map((role) => {
                  const active = role.id === inviteRole;
                  return (
                    <button
                      key={role.id}
                      type="button"
                      aria-pressed={active}
                      onClick={() => setInviteRole(role.id)}
                      className={cn(
                        "flex flex-col gap-1 rounded-btn border-2 p-4 text-left font-sans text-navy-900",
                        active ? "border-gold-500 bg-selected" : "border-line-warm bg-white",
                      )}
                    >
                      <span className="font-display text-[15px] font-semibold">{role.name}</span>
                      <span className="text-[13px] leading-normal text-subtle">{role.description}</span>
                    </button>
                  );
                })}
              </div>
            </fieldset>
            <div className="flex flex-wrap justify-end gap-2.5">
              <button type="button" onClick={() => setInviteOpen(false)} className={portalButton("outline", 46)}>
                Cancelar
              </button>
              <button type="submit" className={portalButton("navy", 46, { padding: "px-[22px]!" })}>
                Enviar invitación
              </button>
            </div>
          </form>
        ) : null}

        {blocking ? (
          <section
            role="alertdialog"
            aria-labelledby="bloquear-titulo"
            aria-describedby="bloquear-texto"
            className="flex flex-col gap-3.5 rounded-panel border border-[#E8B4AE] bg-white px-[26px] py-6 shadow-[0_12px_32px_rgba(155,44,34,0.08)]"
          >
            <div>
              <h2 id="bloquear-titulo" className={panelTitle}>
                ¿Bloquear a {blocking.email}?
              </h2>
              <p id="bloquear-texto" className="mt-1.5 mb-0 text-sm leading-[1.55] text-subtle">
                No podrá ingresar a SEGlobal 360 hasta que un administrador lo desbloquee.
              </p>
            </div>
            <label className="flex flex-col gap-2">
              <span className="flex justify-between gap-3">
                <span className="text-sm font-semibold">
                  ¿Por qué lo bloqueas? <span className="font-normal text-subtle">(obligatorio)</span>
                </span>
                <span className="text-xs text-subtle">
                  {blockReason.length} / {maxReason}
                </span>
              </span>
              <textarea
                ref={blockRef}
                rows={3}
                maxLength={maxReason}
                value={blockReason}
                onChange={(event) => setBlockReason(event.target.value)}
                aria-invalid={showBlockError}
                aria-describedby={showBlockError ? "bloquear-error" : undefined}
                className={cn(textareaClass, "min-h-0! resize-y", showBlockError && "border-danger-fg!")}
              />
              {showBlockError ? (
                <span id="bloquear-error" role="alert" className="text-[13px] font-medium text-danger-fg">
                  Cuéntanos por qué bloqueas a este usuario.
                </span>
              ) : null}
            </label>
            <div className="flex flex-wrap justify-end gap-2.5">
              <button type="button" onClick={() => setBlocking(null)} className={portalButton("outline", 46)}>
                No, mantenerlo
              </button>
              <button
                type="button"
                onClick={confirmBlock}
                className={portalButton("dangerSolid", 46, { padding: "px-[22px]!" })}
              >
                Sí, bloquear
              </button>
            </div>
          </section>
        ) : null}

        <Panel aria-label="Usuarios de la empresa" className="overflow-hidden">
          <Table minWidth={880}>
            <thead>
              <tr>
                <Th>Usuario</Th>
                <Th>Rol</Th>
                <Th>Estado</Th>
                <Th>Último ingreso</Th>
                <Th className="text-right!">Acciones</Th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => {
                const isMe = user.id === session.userId;
                const status = userStatus[user.status];
                const action = isMe ? undefined : primaryAction[user.status];
                return (
                  <tr key={user.id}>
                    <Td className="py-4!">
                      <span className="flex items-center gap-3">
                        <span
                          aria-hidden="true"
                          className={cn(
                            "grid size-9 shrink-0 place-items-center rounded-full font-display text-xs font-bold",
                            isMe ? "bg-gold-500 text-navy-950" : "bg-navy-900 text-gold-300",
                          )}
                        >
                          {user.initials}
                        </span>
                        <span className="flex min-w-0 flex-col gap-0.5">
                          <span className="font-semibold">{isMe ? user.fullName : user.email}</span>
                          <span className="text-[13px] text-subtle">
                            {isMe
                              ? user.email
                              : user.status === "pending_verification"
                                ? "Invitación enviada"
                                : "Usuario de la empresa"}
                          </span>
                        </span>
                      </span>
                    </Td>
                    <Td className="py-4!">
                      {isMe ? (
                        <span className="font-medium">{roleName(user.role)}</span>
                      ) : (
                        <label className="flex">
                          <span className="visually-hidden">Rol de {user.email}</span>
                          <select
                            value={user.role}
                            onChange={(event) => {
                              if (isRole(event.target.value)) updateUser(user.id, { role: event.target.value });
                            }}
                            className="min-h-10 rounded-[10px] border border-line-strong bg-white px-2.5 font-sans text-[13px] font-medium text-navy-900"
                          >
                            {companyRoles.map((role) => (
                              <option key={role.id} value={role.id}>
                                {role.name}
                              </option>
                            ))}
                          </select>
                        </label>
                      )}
                    </Td>
                    <Td className="py-4!">
                      <StatusPill tone={status.tone}>{status.label}</StatusPill>
                    </Td>
                    <Td className="py-4! whitespace-nowrap text-subtle">{user.lastLoginLabel}</Td>
                    <Td className="py-4!">
                      <div className="flex justify-end gap-2">
                        {isMe ? (
                          <span className="rounded-full bg-[#F3F1EB] px-3 py-1.5 text-xs font-semibold text-ink">
                            Eres tú
                          </span>
                        ) : null}
                        {action ? (
                          <button
                            type="button"
                            onClick={() => updateUser(user.id, { status: action.next })}
                            aria-label={`${action.label} a ${user.email}`}
                            className={portalButton("outline", 38)}
                          >
                            {action.label}
                          </button>
                        ) : null}
                        {!isMe && user.status !== "blocked" ? (
                          <button
                            type="button"
                            onClick={() => startBlock(user)}
                            aria-label={`Bloquear a ${user.email}`}
                            className={portalButton("danger", 38)}
                          >
                            Bloquear
                          </button>
                        ) : null}
                      </div>
                    </Td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
          <p className="m-0 border-t border-line px-6 py-3.5 text-[13px] text-subtle">
            Tu empresa necesita al menos un administrador activo. Para bloquear a alguien te pediremos el motivo.
          </p>
        </Panel>
      </main>
    </>
  );
}
