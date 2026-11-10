import { ArrowRight, Bell, Clock, Plus } from "lucide-react";
import Link from "next/link";
import { clientStage } from "@/features/client/model";
import { cn } from "@/shared/lib/cn";
import { demo, routes } from "@/shared/lib/routes";
import { Eyebrow } from "@/shared/ui/Card";
import { company, inquiries, quotes, session } from "./fixtures";
import { formatDate, formatMoney } from "./format";
import { RecentInquiries } from "./RecentInquiries";
import { headerClass, mainClass, portalButton } from "./ui";

const closedStatuses = new Set(["won", "lost", "cancelled"]);

/** Inicio del portal del cliente: saludo, indicadores, cotización por responder y solicitudes recientes. */
export function ClientHome() {
  const isPending = company.status === "pending_validation";
  const stage = isPending ? "registered" : company.stage;
  const rows = isPending ? [] : inquiries;
  const companyQuotes = isPending ? [] : quotes;
  const pendingQuote = companyQuotes.find((quote) => quote.status === "sent");
  const stats = [
    { label: "Solicitudes abiertas", value: rows.filter((row) => !closedStatuses.has(row.status)).length },
    { label: "Cotizaciones por responder", value: companyQuotes.filter((quote) => quote.status === "sent").length },
    { label: "Cotizaciones aceptadas", value: companyQuotes.filter((quote) => quote.status === "accepted").length },
  ];

  return (
    <div className="flex flex-col">
      <header className={cn(headerClass, "flex flex-wrap items-center justify-between gap-4")}>
        <div>
          <Eyebrow>Cliente {clientStage[stage].label.toLowerCase()}</Eyebrow>
          <h1 className="mt-2 mb-0 font-display text-[30px] font-bold tracking-[-0.02em]">Hola, {session.firstName}</h1>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            aria-label="Notificaciones"
            className="relative grid size-11 place-items-center rounded-full border border-line-warm bg-white text-navy-900"
          >
            <Bell size={18} strokeWidth={1.75} aria-hidden="true" />
            <span aria-hidden="true" className="absolute top-[9px] right-2.5 size-2 rounded-full bg-gold-500" />
          </button>
          {isPending ? (
            <button
              type="button"
              disabled
              className="inline-flex min-h-11 items-center gap-2 rounded-btn border-0 bg-[#E6E2D8] px-5 font-sans text-sm font-semibold text-muted-fg"
            >
              Nueva solicitud
            </button>
          ) : (
            <Link href={routes.client.newInquiry} className={portalButton("gold", 44, { className: "gap-2!" })}>
              <Plus size={18} strokeWidth={2} aria-hidden="true" />
              Nueva solicitud
            </Link>
          )}
        </div>
      </header>

      <main className={cn(mainClass, "flex flex-col gap-6")}>
        {isPending ? (
          <div
            role="status"
            className="flex items-start gap-3.5 rounded-tile border border-sand-line bg-sand px-5 py-[18px] text-warn-ink"
          >
            <Clock size={22} strokeWidth={1.75} aria-hidden="true" className="shrink-0" />
            <div>
              <p className="m-0 text-[15px] font-semibold">Estamos validando tu empresa</p>
              <p className="mt-1 mb-0 text-sm leading-[1.55]">
                Operaciones revisa tus datos y te avisa por correo. Mientras tanto puedes explorar el marketplace; las
                solicitudes se habilitan cuando la empresa quede activa.
              </p>
            </div>
          </div>
        ) : null}

        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(220px,100%),1fr))] gap-4">
          {stats.map((stat) => (
            <div key={stat.label} className="rounded-tile border border-[#E9E6DE] bg-white p-5">
              <p className="m-0 text-[13px] text-subtle">{stat.label}</p>
              <p className="mt-2 mb-0 font-display text-[32px] font-semibold">{stat.value}</p>
            </div>
          ))}
        </div>

        {pendingQuote ? (
          <section
            aria-label="Cotización por responder"
            className="flex flex-wrap items-center justify-between gap-5 rounded-panel bg-navy-900 px-7 py-[26px] text-white"
          >
            <div className="flex flex-col gap-2">
              <p className="m-0 text-[13px] font-semibold tracking-[0.01em] text-gold-300">
                Tienes una cotización por responder
              </p>
              <p className="m-0 font-display text-[22px] font-medium">
                {pendingQuote.code} · {pendingQuote.title}
              </p>
              <p className="m-0 text-sm text-white/75">
                Solicitud {pendingQuote.inquiryCode} · Vence el {formatDate(pendingQuote.validUntil)}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-5">
              <div className="text-right">
                <p className="m-0 text-xs text-white/65">Total</p>
                <p className="mt-0.5 mb-0 font-display text-[26px] font-semibold text-gold-300">
                  {formatMoney(pendingQuote.total)}
                </p>
              </div>
              <Link href={routes.client.inquiry(demo.inquiry)} className={portalButton("gold", 48, { className: "gap-2!" })}>
                Revisar cotización
                <ArrowRight size={16} strokeWidth={2} aria-hidden="true" />
              </Link>
            </div>
          </section>
        ) : null}

        <RecentInquiries rows={rows} />
      </main>
    </div>
  );
}
