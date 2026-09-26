import Image from "next/image";
import { Marquee } from "@/components/ui/marquee";
import { Container, Section, SectionHeader } from "@/components/ui/section";
import { aliados } from "@/content/home";
import { sponsors } from "@/content/sponsors";
import { visible } from "@/lib/content";

/** Aliados. Cinta en bucle continuo. Sin aliados publicados, la sección no se renderiza. */
export function Aliados() {
  const items = visible(sponsors);
  if (items.length === 0) return null;

  const cells = items.map((s) => {
    const content = s.logo ? (
      <Image
        src={s.logo.src}
        width={s.logo.width}
        height={s.logo.height}
        alt={s.logo.alt || s.name}
        className="max-h-12 w-auto max-w-full object-contain [filter:var(--iq-logo-filter)] opacity-80 transition-opacity duration-(--iq-duration-fast) group-hover:opacity-100"
      />
    ) : (
      <span className="type-label text-fg-subtle">{s.name}</span>
    );
    return (
      <li
        key={s.id}
        className="group relative grid aspect-[3/2] w-[clamp(10rem,22vw,16rem)] shrink-0 place-items-center border-r border-line p-6"
      >
        {s.href ? (
          <a href={s.href} className="grid size-full place-items-center">
            {content}
          </a>
        ) : (
          content
        )}
      </li>
    );
  });

  return (
    // Media altura: la sección se sale del ritmo vertical común (py-section) a propósito.
    <Section
      id="aliados"
      surface="light"
      labelledBy="aliados-title"
      padded={false}
      className="py-[calc(var(--iq-layout-section-y)/4)]"
    >
      <Container>
        <SectionHeader
          label={aliados.label}
          title={aliados.title}
          titleId="aliados-title"
          showTitle={false}
        />

        <div className="mt-4 lg:mt-6" data-reveal="fade">
          <Marquee duration={items.length * 6} className="border-y border-line">
            {cells}
          </Marquee>
        </div>
      </Container>
    </Section>
  );
}
