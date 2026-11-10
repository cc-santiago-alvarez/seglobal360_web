"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Check, UserPlus, X } from "lucide-react";
import { userStatus, type UserStatus } from "@/features/user/model";
import { cn } from "@/shared/lib/cn";
import { Button } from "@/shared/ui/Button";
import { Panel, SectionTitle } from "@/shared/ui/Card";
import { Field, Select, TextArea, TextInput } from "@/shared/ui/Field";
import { countryName } from "@/shared/ui/Flag";
import { PageBody, PageHeader } from "@/shared/ui/PageHeader";
import { StatusPill } from "@/shared/ui/StatusPill";
import { Table, TableFooter, Td, Th } from "@/shared/ui/Table";
import {
  companyRole,
  companyUsers,
  documentTypes,
  operatorCountryOptions,
  portalCopy,
  type CompanyRole,
  type CompanyUser,
  type ProviderPortal,
} from "./fixtures";
import { Req } from "./ProfileParts";

const roles: ReadonlyArray<CompanyRole> = ["admin", "operator"];

/** Acción principal de cada estado: a qué estado lleva y cómo se avisa. */
const primaryAction: Partial<Record<UserStatus, { label: string; next: UserStatus; done: string }>> = {
  active: { label: "Desactivar", next: "inactive", done: "quedó inactivo." },
  inactive: { label: "Activar", next: "active", done: "quedó activo." },
  blocked: { label: "Desbloquear", next: "active", done: "quedó desbloqueado." },
};

const pillButton = "min-h-[38px] rounded-full border bg-white px-3.5 text-[13px] font-semibold";

/** Usuarios de la empresa proveedora: invitar, cambiar rol, activar, desactivar y bloquear. */
export function CompanyUsers({ portal }: { portal: ProviderPortal }) {
  const copy = portalCopy[portal];
  const inviteTitleId = useId();
  const emailErrorId = useId();
  const dialogTitleId = useId();
  const reasonErrorId = useId();
  const firstInviteField = useRef<HTMLInputElement>(null);
  const reasonField = useRef<HTMLTextAreaElement>(null);
  const invitesSent = useRef(0);

  const [users, setUsers] = useState<CompanyUser[]>(companyUsers[portal]);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteRole, setInviteRole] = useState<CompanyRole>("operator");
  const [newEmail, setNewEmail] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [sentTo, setSentTo] = useState("");
  const [blocking, setBlocking] = useState<CompanyUser | null>(null);
  const [reason, setReason] = useState("");
  const [reasonError, setReasonError] = useState(false);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    if (inviteOpen) firstInviteField.current?.focus();
  }, [inviteOpen]);

  useEffect(() => {
    if (blocking) reasonField.current?.focus();
  }, [blocking]);

  function update(user: CompanyUser, patch: Partial<CompanyUser>, message: string) {
    setUsers(users.map((other) => (other.userId === user.userId ? { ...other, ...patch } : other)));
    setNotice(message);
  }

  function openInvite() {
    setInviteOpen(true);
    setSentTo("");
    setNotice("");
  }

  function closeInvite() {
    setInviteOpen(false);
    setEmailError(false);
  }

  function sendInvite(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const email = newEmail.trim();
    if (!email) {
      setEmailError(true);
      return;
    }
    invitesSent.current += 1;
    setUsers([
      ...users,
      {
        userId: `invite-${invitesSent.current}`,
        email,
        initials: email.slice(0, 2).toUpperCase(),
        role: inviteRole,
        status: "pending_verification",
        lastLogin: "—",
      },
    ]);
    setInviteOpen(false);
    setSentTo(email);
    setNewEmail("");
    setEmailError(false);
  }

  function openBlock(user: CompanyUser) {
    setBlocking(user);
    setReason("");
    setReasonError(false);
    setNotice("");
  }

  function closeBlock() {
    setBlocking(null);
    setReason("");
    setReasonError(false);
  }

  function confirmBlock() {
    if (!blocking) return;
    const motive = reason.trim();
    if (!motive) {
      setReasonError(true);
      return;
    }
    update(blocking, { status: "blocked" }, `${blocking.email} quedó bloqueado. Motivo: ${motive}`);
    closeBlock();
  }

  const showEmailError = emailError && newEmail.trim() === "";
  const showReasonError = reasonError && reason.trim() === "";

  return (
    <>
      <PageHeader
        title="Usuarios"
        description="Las personas de tu empresa que usan SEGlobal 360 y lo que cada una puede hacer."
        actions={
          inviteOpen ? null : (
            <Button variant="gold" size="md" onClick={openInvite}>
              <UserPlus size={18} strokeWidth={2} aria-hidden="true" />
              Invitar usuario
            </Button>
          )
        }
      />

      <PageBody>
        {sentTo ? (
          <div role="status" className="flex items-center gap-3 rounded-[14px] bg-success-bg px-[18px] py-3.5 text-sm font-medium text-[#154F2E]">
            <Check size={18} strokeWidth={2} aria-hidden="true" className="shrink-0" />
            Invitación enviada a {sentTo}. La persona recibirá un correo para crear su contraseña.
          </div>
        ) : null}

        {inviteOpen ? (
          <form
            aria-labelledby={inviteTitleId}
            noValidate
            onSubmit={sendInvite}
            className="flex flex-col gap-[18px] rounded-panel border border-gold-500 bg-white px-[26px] py-6 shadow-[0_0_0_4px_rgba(201,164,92,0.12)]"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <SectionTitle id={inviteTitleId}>Invitar usuario</SectionTitle>
                <p className="mt-1.5 text-sm text-subtle">
                  Le llegará un correo para aceptar la invitación y crear su contraseña.
                </p>
              </div>
              <button
                type="button"
                aria-label="Cerrar"
                onClick={closeInvite}
                className="grid size-11 shrink-0 place-items-center rounded-full bg-[#F3F1EB] text-navy-900"
              >
                <X size={18} strokeWidth={2} aria-hidden="true" />
              </button>
            </div>

            <div className="grid grid-cols-[repeat(auto-fit,minmax(min(220px,100%),1fr))] gap-x-5 gap-y-4">
              <Field label={<RequiredLabel text="Nombres" />}>
                <TextInput ref={firstInviteField} type="text" required autoComplete="off" />
              </Field>
              <Field label={<RequiredLabel text="Apellidos" />}>
                <TextInput type="text" required autoComplete="off" />
              </Field>
              <Field label={<RequiredLabel text="Correo" />}>
                <TextInput
                  type="email"
                  required
                  autoComplete="off"
                  value={newEmail}
                  placeholder="nombre@empresa.com"
                  aria-invalid={showEmailError || undefined}
                  aria-describedby={showEmailError ? emailErrorId : undefined}
                  onChange={(event) => setNewEmail(event.target.value)}
                />
              </Field>
            </div>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(min(200px,100%),1fr))] gap-x-5 gap-y-4">
              <Field label={<RequiredLabel text="País del documento" />}>
                <Select defaultValue="CO">
                  {operatorCountryOptions.map((code) => (
                    <option key={code} value={code}>
                      {countryName[code]}
                    </option>
                  ))}
                </Select>
              </Field>
              <Field label={<RequiredLabel text="Tipo de documento" />}>
                <Select>
                  {documentTypes.map((type) => (
                    <option key={type}>{type}</option>
                  ))}
                </Select>
              </Field>
              <Field label={<RequiredLabel text="Número" />}>
                <TextInput type="text" required autoComplete="off" />
              </Field>
            </div>

            <fieldset className="min-w-0">
              <legend className="pb-2.5 text-[13px] font-semibold">
                Rol
                <Req />
              </legend>
              <div className="grid grid-cols-[repeat(auto-fit,minmax(min(260px,100%),1fr))] gap-3">
                {roles.map((role) => {
                  const on = role === inviteRole;
                  return (
                    <button
                      key={role}
                      type="button"
                      aria-pressed={on}
                      onClick={() => setInviteRole(role)}
                      className={cn(
                        "flex flex-col gap-1 rounded-[14px] border-2 p-4 text-left text-navy-900",
                        on ? "border-gold-500 bg-selected" : "border-line-warm bg-white",
                      )}
                    >
                      <span className="font-display text-[15px] font-semibold">{companyRole[role]}</span>
                      <span className="text-[13px] leading-normal text-subtle">{copy.roleDescription[role]}</span>
                    </button>
                  );
                })}
              </div>
            </fieldset>

            <div className="flex flex-wrap justify-end gap-2.5">
              <Button variant="outline" size="md" onClick={closeInvite}>
                Cancelar
              </Button>
              {showEmailError ? (
                <span id={emailErrorId} role="alert" className="self-center text-[13px] font-medium text-danger-fg">
                  Escribe el correo de la persona.
                </span>
              ) : null}
              <Button type="submit" variant="navy" size="md">
                Enviar invitación
              </Button>
            </div>
          </form>
        ) : null}

        {blocking ? (
          <section
            role="alertdialog"
            aria-labelledby={dialogTitleId}
            className="flex flex-col gap-3.5 rounded-panel border border-[#E8B4AE] bg-white px-6 py-[22px] shadow-[0_12px_32px_rgba(11,27,51,0.08)]"
          >
            <div>
              <SectionTitle id={dialogTitleId}>Bloquear a {blocking.email}</SectionTitle>
              <p className="mt-1.5 text-sm leading-[1.55] text-subtle">No podrá ingresar hasta que lo desbloquees.</p>
            </div>
            <label className="flex flex-col gap-2">
              <span className="flex justify-between gap-3">
                <span className="text-sm font-semibold">
                  Motivo del bloqueo <span className="font-normal text-subtle">(obligatorio)</span>
                </span>
                <span className="text-xs text-subtle">{reason.length} / 500</span>
              </span>
              <TextArea
                ref={reasonField}
                rows={3}
                maxLength={500}
                value={reason}
                aria-invalid={showReasonError || undefined}
                aria-describedby={showReasonError ? reasonErrorId : undefined}
                onChange={(event) => setReason(event.target.value)}
                className={cn("min-h-0! resize-y", showReasonError && "border-danger-fg")}
              />
              {showReasonError ? (
                <span id={reasonErrorId} role="alert" className="text-[13px] font-medium text-danger-fg">
                  Escribe el motivo para continuar.
                </span>
              ) : null}
            </label>
            <div className="flex flex-wrap justify-end gap-2.5">
              <Button variant="outline" size="md" onClick={closeBlock}>
                Volver
              </Button>
              <Button variant="navy" size="md" onClick={confirmBlock} className="bg-danger-fg!">
                Bloquear
              </Button>
            </div>
          </section>
        ) : null}

        {notice ? (
          <div role="status" className="rounded-[14px] bg-success-bg px-[18px] py-3.5 text-sm font-medium text-[#154F2E]">
            {notice}
          </div>
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
                const status = userStatus[user.status];
                const action = user.isMe ? undefined : primaryAction[user.status];
                const canBlock = !user.isMe && user.status !== "blocked" && user.status !== "pending_verification";
                return (
                  <tr key={user.userId}>
                    <Td>
                      <span className="flex items-center gap-3">
                        <span
                          aria-hidden="true"
                          className={cn(
                            "grid size-9 shrink-0 place-items-center rounded-full font-display text-xs font-bold",
                            user.isMe ? "bg-gold-500 text-navy-950" : "bg-navy-900 text-gold-300",
                          )}
                        >
                          {user.initials}
                        </span>
                        <span className="flex min-w-0 flex-col gap-0.5">
                          <span className="font-semibold">{user.isMe && user.name ? user.name : user.email}</span>
                          <span className="text-[13px] text-subtle">
                            {user.isMe
                              ? user.email
                              : user.status === "pending_verification"
                                ? "Invitación enviada"
                                : "Usuario de la empresa"}
                          </span>
                        </span>
                      </span>
                    </Td>
                    <Td>
                      {user.isMe ? (
                        <span className="font-medium">{companyRole[user.role]}</span>
                      ) : (
                        <label className="flex">
                          <span className="visually-hidden">Rol de {user.email}</span>
                          <select
                            value={user.role}
                            onChange={(event) => {
                              const role = roles.find((option) => option === event.target.value);
                              if (role) update(user, { role }, `Rol de ${user.email} cambiado a ${companyRole[role]}.`);
                            }}
                            className="min-h-10 rounded-[10px] border border-line-strong bg-white px-2.5 text-[13px] font-medium text-navy-900"
                          >
                            {roles.map((role) => (
                              <option key={role} value={role}>
                                {companyRole[role]}
                              </option>
                            ))}
                          </select>
                        </label>
                      )}
                    </Td>
                    <Td>
                      <StatusPill tone={status.tone}>{status.label}</StatusPill>
                    </Td>
                    <Td className="whitespace-nowrap text-subtle">{user.lastLogin}</Td>
                    <Td>
                      <div className="flex justify-end gap-2">
                        {user.isMe ? (
                          <span className="rounded-full bg-[#F3F1EB] px-3 py-1.5 text-xs font-semibold text-ink">Eres tú</span>
                        ) : null}
                        {action ? (
                          <button
                            type="button"
                            onClick={() => update(user, { status: action.next }, `${user.email} ${action.done}`)}
                            className={cn(pillButton, "border-line-strong text-navy-900")}
                          >
                            {action.label}
                          </button>
                        ) : null}
                        {canBlock ? (
                          <button
                            type="button"
                            onClick={() => openBlock(user)}
                            className={cn(pillButton, "border-[#E8B4AE] text-danger-fg")}
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
          <TableFooter>
            Tu empresa necesita al menos un administrador activo. Para bloquear a alguien te pediremos el motivo.
          </TableFooter>
        </Panel>
      </PageBody>
    </>
  );
}

function RequiredLabel({ text }: { text: string }) {
  return (
    <>
      {text}
      <Req />
    </>
  );
}
