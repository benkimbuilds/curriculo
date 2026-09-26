import { Logo } from "@/components/brand/logo";
import { ThreadField } from "@/components/brand/thread-field";
import { LetterSwap } from "@/components/motion/letter-swap";
import { ButtonLink } from "@/components/ui/button";
import { Meta } from "@/components/ui/meta";
import { site } from "@/config/site";
import { hero } from "@/content/home";

/**
 * Apertura (superficie blanca). Primer viewport identifica el Centro y ofrece dos caminos (Hick).
 * Composición vertical alrededor del nodo del campo de hilos: titular arriba, nodo en el hueco,
 * texto y acciones debajo — los abanicos de hilos quedan a los lados y no cruzan la lectura.
 *
 * La entrada usa `data-intro` (CSS puro): el contenido visible al cargar nunca espera a JS (LCP).
 */
export function Hero() {
  return (
    <section
      id="inicio"
      data-surface="white"
      aria-labelledby="inicio-title"
      className="relative isolate flex min-h-svh flex-col overflow-hidden bg-bg pt-header text-fg"
    >
      <ThreadField anchorId="hero-node" className="absolute inset-0 -z-10 size-full" />

      <div className="mx-auto flex w-full max-w-content flex-1 flex-col px-gutter pt-6 pb-8 md:pt-8">
        <div className="flex items-start justify-between gap-6" data-intro="fade">
          <Meta className="hidden sm:block">{hero.eyebrow}</Meta>
          <Meta className="ml-auto sm:hidden">{site.coordinate}</Meta>
          <Meta className="ml-auto hidden sm:block">{hero.academy}</Meta>
        </div>

        <div className="flex flex-1 flex-col items-center justify-center py-10 text-center">
          <h1 id="inicio-title">
            <span className="sr-only">
              {hero.title}, {hero.titleNote}
            </span>
            {/* Logo original (vertical). La marca gráfica ocupa ~60 % del alto: ≥ 160 px en escritorio. */}
            <span className="block" data-intro="up">
              <Logo name="vertical" alt="" lcp className="w-[11rem] sm:w-[13rem] lg:w-[16rem]" />
            </span>
          </h1>

          {/* Hueco donde convergen los hilos. */}
          <span id="hero-node" aria-hidden="true" className="block h-[clamp(5.5rem,16svh,11rem)] w-px" />

          <LetterSwap
            text={hero.lead}
            direction="top"
            trigger="load"
            delay={250}
            stagger={12}
            className="type-lead max-w-[36ch] text-fg-muted"
          />

          <div
            className="mt-10 flex w-full flex-col items-stretch justify-center gap-3 sm:w-auto sm:flex-row sm:items-center"
            data-intro="up"
            style={{ animationDelay: "400ms" }}
          >
            <ButtonLink href={hero.primaryCta.href}>{hero.primaryCta.label}</ButtonLink>
            <ButtonLink href={hero.secondaryCta.href} variant="secondary" className="bg-bg">
              {hero.secondaryCta.label}
            </ButtonLink>
          </div>
        </div>

        {/* En móvil el indicador queda centrado y sin etiqueta; desde sm, a la derecha con «Desliza». */}
        <div
          aria-hidden="true"
          className="flex items-center justify-center gap-3 sm:justify-end"
          data-intro="fade"
          style={{ animationDelay: "900ms" }}
        >
          <span className="type-meta text-fg-subtle max-sm:hidden">Desliza</span>
          {/* 1.5 px + 12 %. */}
          <span className="scroll-cue relative block h-10 w-[1.68px] overflow-hidden bg-line-strong/40" />
        </div>
      </div>
    </section>
  );
}
