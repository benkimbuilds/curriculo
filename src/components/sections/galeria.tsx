import { PhotoArc } from "@/components/ui/photo-arc";
import { Container, Section, SectionHeader } from "@/components/ui/section";
import { galleryItems } from "@/content/gallery";
import { galeria } from "@/content/home";

/** Galería. Arco de fotos a sangre; el encabezado sigue en el contenedor. */
export function Galeria() {
  if (galleryItems.length === 0) return null;

  return (
    <Section id="galeria" surface="brand" labelledBy="galeria-title">
      <div aria-hidden="true" className="grid-dots absolute inset-0 -z-10" />
      <Container>
        <SectionHeader
          label={galeria.label}
          title={galeria.title}
          titleId="galeria-title"
          showTitle={false}
          lead={galeria.lead}
        />
      </Container>
      <PhotoArc items={galleryItems} className="mt-16 lg:mt-24" />
    </Section>
  );
}
