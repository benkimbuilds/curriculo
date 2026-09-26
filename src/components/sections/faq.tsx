import { Plus } from "@/components/ui/icons";
import { Container, Section, SectionHeader } from "@/components/ui/section";
import { faqItems } from "@/content/faq";
import { faq } from "@/content/home";
import { visible } from "@/lib/content";

/**
 * Preguntas frecuentes con <details> nativo: funciona sin JS, es buscable con Ctrl+F y accesible
 * por defecto. `name` las vuelve exclusivas (una abierta a la vez) en navegadores compatibles.
 */
export function Faq() {
  const items = visible(faqItems);
  if (items.length === 0) return null;

  return (
    <Section id="faq" surface="light" labelledBy="faq-title">
      <Container>
        <SectionHeader label={faq.label} title={faq.title} titleId="faq-title" showTitle={false} />

        <div className="mx-auto mt-16 w-full border-t border-line lg:mt-24 lg:w-3/4" data-reveal="stagger">
          {items.map((item, i) => (
            <details key={item.id} name="faq" open={i === 0} className="faq-item group border-b border-line">
              <summary className="flex min-h-target cursor-pointer items-start gap-4 py-6 transition-colors duration-(--iq-duration-fast) hover:text-accent md:gap-8 md:py-8">
                <span aria-hidden="true" className="type-meta w-8 shrink-0 pt-2 tabular-nums text-accent">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="type-lead flex-1 text-pretty">{item.question}</span>
                <Plus className="mt-1 size-6 shrink-0 transition-transform duration-(--iq-duration-base) ease-out group-open:rotate-45" />
              </summary>
              <div className="pb-8 pl-12 md:pl-16">
                <p className="type-body max-w-reading text-fg-muted">{item.answer}</p>
              </div>
            </details>
          ))}
        </div>
      </Container>
    </Section>
  );
}
