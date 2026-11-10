import { ContactHero, ContactProviderCard, ContactQuoteCard } from "@/features/access/ContactSections";
import { ContactWhatsAppCard } from "@/features/access/ContactWhatsAppCard";
import { contactTopics, whatsappPhone, whatsappPhoneLabel } from "@/features/access/fixtures";
import { PublicFooter } from "@/shared/ui/PublicFooter";
import { PublicHeader } from "@/shared/ui/PublicHeader";

export const metadata = { title: "Contacto" };

export default function ContactPage() {
  return (
    <>
      <PublicHeader variant="glass" />
      <ContactHero />
      <main className="mx-auto max-w-[1240px] px-6 pb-20">
        <div className="relative -mt-12 grid grid-cols-[repeat(auto-fit,minmax(min(320px,100%),1fr))] gap-5">
          <ContactWhatsAppCard topics={contactTopics} phone={whatsappPhone} phoneLabel={whatsappPhoneLabel} />
          <ContactQuoteCard />
          <ContactProviderCard />
        </div>
      </main>
      <PublicFooter />
    </>
  );
}
