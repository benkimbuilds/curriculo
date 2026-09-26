import type { Metadata } from "next";
import { Academia } from "@/components/sections/academia";
import { Aliados } from "@/components/sections/aliados";
import { Centro } from "@/components/sections/centro";
import { Faq } from "@/components/sections/faq";
import { Galeria } from "@/components/sections/galeria";
import { Hero } from "@/components/sections/hero";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { SkipLink } from "@/components/layout/skip-link";
import { MotionRoot } from "@/components/motion/motion-root";
import { CurriculumOverview } from "@/components/curriculum-overview";
import { site } from "@/config/site";
import { faqItems } from "@/content/faq";
import { getCurrentSession } from "@/modules/auth/session";
import { getRoleHomeDestination } from "@/modules/authorization/navigation";
import { loadAuthorizationContext } from "@/modules/authorization/service";
import { resolveDefaultOrganizationId } from "@/modules/community/db-community";
import { hasLearningEnrollment } from "@/app/programa/student-data";
import { listCurriculumWeeks } from "@/modules/curriculum";

export const metadata: Metadata = {
  title: "Iquiti — Centro de Innovación y Academia de Tecnología",
  description: "Iquiti reúne innovación, aprendizaje tecnológico y comunidad. Explora el currículo abierto de su Academia de Tecnología.",
};

function StructuredData() {
  const published = faqItems.filter((item) => item.status === "published");
  const graph = [
    {
      "@type": "Organization",
      name: site.name,
      alternateName: "Iquiti",
      url: site.url,
      logo: new URL("/brand/iquiti/logo-vertical.svg", site.url).toString(),
      description: site.description,
      address: {
        "@type": "PostalAddress",
        streetAddress: site.location.street,
        addressLocality: `${site.location.neighborhood}, ${site.location.locality}`,
        addressRegion: site.location.region,
        addressCountry: site.location.country,
      },
    },
    published.length > 0 && {
      "@type": "FAQPage",
      mainEntity: published.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: { "@type": "Answer", text: item.answer },
      })),
    },
  ].filter(Boolean);

  return (
    <script
      type="application/ld+json"
      // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD serializado y escapado, sin entrada de usuario.
      dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@graph": graph }).replace(/</g, "\\u003c") }}
    />
  );
}

export default async function Home() {
  const session = await getCurrentSession();
  const accountLink = session
    ? getRoleHomeDestination(
        (await loadAuthorizationContext(session.user.id, await resolveDefaultOrganizationId())).organizationRoles,
        await hasLearningEnrollment(session.user.id),
      )
    : undefined;
  const accountHref = accountLink?.href ?? "/registro";
  const weeks = listCurriculumWeeks({ locale: "es-MX" });

  return (
    <div data-iquiti-home>
      <StructuredData />
      <SkipLink />
      <SiteHeader platformHref={accountHref} />
      <main id="contenido" tabIndex={-1} className="outline-none">
        <Hero />
        <Centro />
        <Academia platformHref={accountHref} />
        <CurriculumOverview weeks={weeks} accountHref={accountHref} />
        <Aliados />
        <Galeria />
        <Faq />
      </main>
      <SiteFooter platformHref={accountHref} />
      <MotionRoot />
    </div>
  );
}
