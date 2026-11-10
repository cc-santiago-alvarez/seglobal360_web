"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/shared/lib/cn";
import type { Faq } from "./fixtures";

/** Acordeón de preguntas frecuentes: una abierta a la vez, la primera al empezar. */
export function FaqList({ faqs }: { faqs: Faq[] }) {
  const [openId, setOpenId] = useState<string | null>(faqs[0]?.id ?? null);

  return (
    <ul className="min-w-0 flex-[999_1_560px] border-t border-line-warm">
      {faqs.map((faq) => {
        const open = faq.id === openId;
        return (
          <li key={faq.id} className="border-b border-line-warm">
            <button
              type="button"
              aria-expanded={open}
              onClick={() => setOpenId(open ? null : faq.id)}
              className="flex min-h-16 w-full items-center justify-between gap-4 py-4 text-left font-display text-[16px] leading-[normal] font-semibold text-navy-900 transition-colors hover:text-gold-text"
            >
              {faq.question}
              <ChevronDown
                size={18}
                strokeWidth={2}
                aria-hidden="true"
                className={cn("shrink-0", open && "rotate-180")}
              />
            </button>
            {open ? <p className="max-w-[680px] pb-[18px] text-[15px] leading-[1.65] text-ink">{faq.answer}</p> : null}
          </li>
        );
      })}
    </ul>
  );
}
