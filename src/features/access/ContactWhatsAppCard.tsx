"use client";

import { useState } from "react";
import { cn } from "@/shared/lib/cn";
import { WhatsAppIcon, whatsappHref } from "@/shared/ui/WhatsAppIcon";
import type { ContactTopic, ContactTopicId } from "./fixtures";

type Props = {
  topics: ContactTopic[];
  /** Número en formato internacional sin signos, para el enlace. */
  phone: string;
  phoneLabel: string;
};

/** Tarjeta de WhatsApp: el tema elegido arma el mensaje inicial del enlace. */
export function ContactWhatsAppCard({ topics, phone, phoneLabel }: Props) {
  const [topicId, setTopicId] = useState<ContactTopicId | undefined>(topics[0]?.id);
  const topic = topics.find((item) => item.id === topicId) ?? topics[0];
  const message = topic?.message ?? "";

  return (
    <section
      aria-labelledby="wa-titulo"
      className="flex flex-col gap-4 rounded-panel border border-[#E9E6DE] bg-white p-7 shadow-[0_20px_40px_rgba(11,27,51,0.10)]"
    >
      <span aria-hidden="true" className="grid size-12 place-items-center rounded-btn bg-[#25D366] text-white">
        <WhatsAppIcon size={24} />
      </span>
      <h2 id="wa-titulo" className="font-display text-[20px] leading-[normal] font-bold tracking-[-0.02em]">
        Escríbenos por WhatsApp
      </h2>
      <p className="text-[15px] leading-[1.6] text-ink">
        Es el canal más rápido para resolver dudas antes de crear tu cuenta.
      </p>
      <fieldset>
        <legend className="pb-2.5 text-[13px] font-semibold">¿Sobre qué quieres hablar?</legend>
        <div className="flex flex-wrap gap-2">
          {topics.map((item) => {
            const active = item.id === topic?.id;
            return (
              <button
                key={item.id}
                type="button"
                aria-pressed={active}
                onClick={() => setTopicId(item.id)}
                className={cn(
                  "min-h-10 rounded-full border px-3.5 text-[13px] transition-colors",
                  active
                    ? "border-navy-900 bg-navy-900 font-semibold text-white"
                    : "border-line-strong bg-white font-medium text-navy-900 hover:border-navy-900",
                )}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </fieldset>
      <p className="rounded-field bg-ivory px-3.5 py-3 text-sm leading-normal text-ink">
        <span className="block text-xs font-semibold tracking-[0.01em] text-subtle">Mensaje</span>
        {message}
      </p>
      <a
        href={whatsappHref(message, phone)}
        target="_blank"
        rel="noopener noreferrer"
        className="lift mt-auto inline-flex min-h-[50px] items-center justify-center gap-2.5 rounded-btn bg-[#25D366] text-[15px] font-semibold text-navy-950 no-underline"
      >
        Abrir WhatsApp · {phoneLabel}
      </a>
    </section>
  );
}
