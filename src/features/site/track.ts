import { inquiryTrack, type InquiryStatus } from "@/features/inquiry/model";

/** Situación de un paso del seguimiento frente al estado actual. */
export type StepState = "done" | "now" | "next";

/** Pasos del seguimiento que ve el cliente, marcados como hechos, actual o pendientes. */
export function trackProgress(current: InquiryStatus): Array<{ status: InquiryStatus; label: string; state: StepState }> {
  const index = inquiryTrack.findIndex((step) => step.status === current);
  return inquiryTrack.map((step, position) => ({
    ...step,
    state: position < index ? "done" : position === index ? "now" : "next",
  }));
}
