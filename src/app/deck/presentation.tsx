"use client";

import { AnimatedGradient } from "@/components/ui/animated-gradient";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState, type TouchEvent } from "react";
import { deckCopy, type DeckLanguage } from "./copy";
import styles from "./presentation.module.css";

type DeckText = (typeof deckCopy)[DeckLanguage];
const slideCount = deckCopy.es.slides.length;
const firstPillarSlide = 4;
const partners = [
  { name: "OpenAI", src: "/deck/logos/openai.svg", width: 86, height: 24 },
  { name: "Cursor", src: "/deck/logos/cursor.svg", width: 224, height: 53 },
  { name: "SpaceX AI", src: "/deck/logos/spacex-ai.svg", width: 205, height: 25 },
  { name: "Vercel", src: "/deck/logos/vercel.svg", width: 262, height: 52 },
  { name: "Google", src: "/deck/logos/google.png", width: 544, height: 184 },
  { name: "NVIDIA", src: "/deck/logos/nvidia.svg", width: 256, height: 59 },
];

function clampSlide(index: number) {
  return Math.max(0, Math.min(slideCount - 1, index));
}

function slideFromParam(value: string | null) {
  if (!value) return 0;
  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed)) return 0;
  return clampSlide(parsed - 1);
}

export default function Deck() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const index = useMemo(() => slideFromParam(searchParams.get("slide")), [searchParams]);
  const [overview, setOverview] = useState(false);
  const [presenting, setPresenting] = useState(false);
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const [language, setLanguage] = useState<DeckLanguage>("es");
  const t = deckCopy[language];
  const footerLabel = index === 0 || index === slideCount - 1 ? "Iquiti" : t.slides[index].label;
  const goTo = useCallback((next: number) => {
    const clamped = clampSlide(next);
    const params = new URLSearchParams(searchParams.toString());
    if (clamped <= 0) params.delete("slide");
    else params.set("slide", String(clamped + 1));
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
    setOverview(false);
  }, [pathname, router, searchParams]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.altKey || event.ctrlKey || event.metaKey) return;
      if (event.key === " " && event.target instanceof HTMLElement && event.target.closest("button")) return;
      if (["ArrowRight", "ArrowDown", "PageDown", " "].includes(event.key)) {
        event.preventDefault();
        goTo(index + 1);
      } else if (["ArrowLeft", "ArrowUp", "PageUp"].includes(event.key)) {
        event.preventDefault();
        goTo(index - 1);
      } else if (event.key === "Home") {
        event.preventDefault();
        goTo(0);
      } else if (event.key === "End") {
        event.preventDefault();
        goTo(slideCount - 1);
      } else if (event.key.toLowerCase() === "o") {
        setOverview((current) => !current);
      } else if (event.key.toLowerCase() === "p") {
        event.preventDefault();
        if (!event.repeat) {
          setPresenting((current) => !current);
          setOverview(false);
        }
      } else if (event.key === "Escape") {
        setOverview(false);
        setPresenting(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [goTo, index]);

  const onTouchStart = (event: TouchEvent<HTMLElement>) => {
    if (!presenting || event.touches.length !== 1) return;
    touchStart.current = { x: event.touches[0].clientX, y: event.touches[0].clientY };
  };

  const onTouchEnd = (event: TouchEvent<HTMLElement>) => {
    const start = touchStart.current;
    touchStart.current = null;
    if (!presenting || !start || event.changedTouches.length !== 1) return;
    const deltaX = event.changedTouches[0].clientX - start.x;
    const deltaY = event.changedTouches[0].clientY - start.y;
    if (Math.abs(deltaX) > 60 && Math.abs(deltaX) > Math.abs(deltaY) * 1.5) {
      goTo(index + (deltaX < 0 ? 1 : -1));
    }
  };

  return (
    <main data-iquiti-home lang={language === "es" ? "es-MX" : "en"} className={`${styles.deck} ${presenting ? styles.presenting : ""}`} aria-label={t.ui.deck}>
      {!presenting && <header className={styles.chrome}>
        <div className={styles.brand} aria-label="Iquiti">
          <Image src="/brand/iquiti/logotipo-Iquiti.svg" width={800} height={296} alt="Iquiti" priority />
        </div>
        <div className={styles.chromeRight}>
          <span className={styles.deckName}>{t.ui.location}</span>
          <div className={styles.languageToggle} role="group" aria-label={t.ui.language}>
            <button type="button" className={language === "es" ? styles.languageActive : ""} aria-pressed={language === "es"} onClick={() => setLanguage("es")}>ES</button>
            <button type="button" className={language === "en" ? styles.languageActive : ""} aria-pressed={language === "en"} onClick={() => setLanguage("en")}>EN</button>
          </div>
          <button type="button" className={`${styles.overviewButton} ${styles.presentButton}`} onClick={() => { setOverview(false); setPresenting(true); }} aria-label={t.ui.presentAria} title={`${t.ui.presentAria} (P)`}>
            <span>{t.ui.present}</span>
            <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M7 2H2v5M13 2h5v5M2 13v5h5M18 13v5h-5" /></svg>
          </button>
          <button type="button" className={styles.overviewButton} onClick={() => setOverview((current) => !current)} aria-expanded={overview} aria-label={t.ui.overviewAria}><span>{t.ui.overview}</span></button>
        </div>
      </header>}

      {presenting && <button type="button" className={styles.presentationExit} onClick={() => setPresenting(false)} aria-label={t.ui.exitPresentation} title={`${t.ui.exitPresentation} (Esc)`}>×</button>}

      {overview ? (
        <nav className={styles.overview} aria-label={t.ui.overviewNav}>
          {t.slides.map((slide, slideIndex) => (
            <button key={slideIndex} type="button" onClick={() => goTo(slideIndex)} className={slideIndex === index ? styles.overviewActive : ""}>
              <span>{String(slideIndex + 1).padStart(2, "0")}</span>
              <strong>{slide.label}</strong>
              <small>{slide.title}</small>
            </button>
          ))}
        </nav>
      ) : (
        <section className={`${styles.slide} ${index === 0 || index === slideCount - 1 ? styles.cover : ""} ${index === 1 ? styles.problemSlide : ""} ${index === 2 ? styles.thesisSlide : ""} ${index === 3 ? styles.hubSlide : ""} ${index >= firstPillarSlide && index < firstPillarSlide + 5 ? styles.pillarSlide : ""} ${index === 7 ? styles.residencySlide : ""} ${index === 8 ? styles.communitySlide : ""} ${index === 6 || index === 7 ? styles.closingLineSlide : ""} ${index === 4 || index === 5 || index === 6 || index === 7 || index === 9 ? styles.wideTitleSlide : ""}`} aria-roledescription={t.ui.slide} aria-label={`${index + 1} ${t.ui.of} ${slideCount}: ${t.slides[index].label}`} key={`${index}-${language}`} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd} onTouchCancel={() => { touchStart.current = null; }}>
          <SlideContent index={index} t={t} goTo={goTo} />
        </section>
      )}

      {!presenting && <footer className={styles.controls}>
        <div className={styles.progress}><span>{String(index + 1).padStart(2, "0")} / {String(slideCount).padStart(2, "0")}</span><div aria-hidden="true"><i style={{ width: `${((index + 1) / slideCount) * 100}%` }} /></div><span>{footerLabel}</span></div>
        <div className={styles.navigation}><button type="button" onClick={() => goTo(index - 1)} disabled={index === 0} aria-label={t.ui.previous}>←</button><button type="button" onClick={() => goTo(index + 1)} disabled={index === slideCount - 1} aria-label={t.ui.next}>→</button></div>
      </footer>}
      <span className={styles.srOnly} aria-live="polite">{t.ui.slide} {index + 1} {t.ui.of} {slideCount}: {t.slides[index].label}</span>
    </main>
  );
}

function SlideContent({ index, t, goTo }: { index: number; t: DeckText; goTo: (next: number) => void }) {
  switch (index) {
    case 0:
      return <>
        <div className={styles.coverGradient} aria-hidden="true">
          <AnimatedGradient
            variant="mist"
            speed={0.35}
            opacity={1}
            className={styles.coverGradientCanvas}
          />
          <div className={styles.coverGradientVeil} />
        </div>
        <div className={styles.coverCopy}>
          <p className={`${styles.eyebrow} ${styles.coverEyebrow}`}>
            <span className={styles.coverEyebrowLogo} role="img" aria-label="Iquiti" />
            <span aria-hidden="true">·</span>
            <span>{t.cover.eyebrow}</span>
          </p>
          <h1>{t.cover.title} <em>{t.cover.emphasis}</em></h1>
          <p className={styles.lead}>{t.cover.lead}</p>
        </div>
        <BrandGraphic />
      </>;
    case 1:
      return <>
        <div className={styles.problemHero}>
          <SlideHead number="02" category={t.problem.category} title={t.problem.title} />
          <figure className={styles.problemCycle}>
            <Image
              src="/deck/ciclo_roto.png"
              alt={t.problem.cycleAlt}
              width={1672}
              height={941}
              className={styles.problemCycleImage}
              priority
              unoptimized
            />
          </figure>
        </div>
        <div className={styles.problemColumns}>{t.problem.points.map((point, i) => <Statement key={i} number={`0${i + 1}`} title={point.title} body={point.body} />)}</div>
      </>;
    case 2:
      return <>
        <div className={styles.problemHero}>
          <SlideHead number="03" category={t.thesis.category} title={t.thesis.title} />
          <figure className={styles.problemCycle}>
            <Image
              src="/deck/ciclo_regenerativo.png"
              alt={t.thesis.cycleAlt}
              width={1672}
              height={941}
              className={styles.problemCycleImage}
              priority
              unoptimized
            />
          </figure>
        </div>
        <div className={styles.thesisLayout}>
          <p className={styles.bigStatement}>{t.thesis.statement}</p>
          <div className={styles.verticalRule} aria-hidden="true" />
          <div className={styles.thesisList}>{t.thesis.points.map((point) => <p key={point.title}><strong>{point.title}</strong><span>{point.body}</span></p>)}</div>
        </div>
      </>;
    case 3:
      return <>
        <SlideHead number="04" category={t.hub.category} title={t.hub.title} />
        <div className={styles.pillarGrid}>
          {t.hub.pillars.map((pillar, i) => (
            <button
              key={pillar.title}
              type="button"
              className={styles.pillar}
              onClick={() => goTo(firstPillarSlide + i)}
            >
              <span>{`0${i + 1}`}</span>
              <h3>{pillar.title}</h3>
              <p>{pillar.body}</p>
            </button>
          ))}
        </div>
      </>;
    case 4:
      return <>
        <PillarHead number={1} labels={t.hub.pillars} navLabel={t.ui.pillarNav} title={t.academy.title} goTo={goTo} />
        <div className={styles.academyHero}><p>{t.academy.promise}</p><strong>{t.academy.distinction}</strong></div>
        <div className={styles.academyColumns}>{t.academy.points.map((point, i) => <Statement key={i} number={`0${i + 1}`} title={point.title} body={point.body} />)}</div>
        <p className={styles.bottomLine}>{t.academy.bottom}</p>
      </>;
    case 5:
      return <>
        <PillarHead number={2} labels={t.hub.pillars} navLabel={t.ui.pillarNav} title={t.coworking.title} goTo={goTo} />
        <div className={styles.split}>
          <div className={styles.featurePanel}><span className={styles.featureNumber}>01 / 02</span><h3>{t.coworking.entry.title}</h3><p>{t.coworking.entry.body}</p></div>
          <div className={styles.featurePanel}><span className={styles.featureNumber}>02 / 02</span><h3>{t.coworking.next.title}</h3><p>{t.coworking.next.body}</p></div>
        </div>
        <p className={styles.bottomLine}>{t.coworking.bottom}</p>
      </>;
    case 6:
      return <>
        <PillarHead number={3} labels={t.hub.pillars} navLabel={t.ui.pillarNav} title={t.grants.title} goTo={goTo} />
        <div className={styles.split}>
          <div className={styles.simplePanel}><span className={styles.dot} /><h3>{t.grants.need.title}</h3><p>{t.grants.need.body}</p><small>{t.grants.need.note}</small></div>
          <div className={styles.simplePanel}><span className={styles.dot} /><h3>{t.grants.teams.title}</h3><p>{t.grants.teams.body}</p><small>{t.grants.teams.note}</small></div>
        </div>
        <p className={styles.bottomLine}>{t.grants.bottom}</p>
      </>;
    case 7:
      return <>
        <PillarHead number={4} labels={t.hub.pillars} navLabel={t.ui.pillarNav} title={t.residencies.title} goTo={goTo} />
        <div className={styles.split}>
          <div className={styles.featurePanel}><span className={styles.featureNumber}>01 / 02</span><h3>{t.residencies.invited.title}</h3><p>{t.residencies.invited.body}</p></div>
          <div className={styles.featurePanel}><span className={styles.featureNumber}>02 / 02</span><h3>{t.residencies.exchange.title}</h3><p>{t.residencies.exchange.body}</p></div>
        </div>
        <p className={styles.bottomLine}>{t.residencies.bottom}</p>
      </>;
    case 8:
      return <>
        <PillarHead number={5} labels={t.hub.pillars} navLabel={t.ui.pillarNav} title={t.events.title} goTo={goTo} />
        <div className={styles.eventsLayout}>
          <section className={styles.eventsProofCard}><Image className={styles.eventsProofLogo} src="/deck/logos/ai-builders-mexico.svg" width={393} height={95} alt="AI Builders México" /><strong className={styles.eventsProofValue}>5,000</strong><span className={styles.eventsProofLabel}>{t.events.community}</span><p>{t.events.cadence}</p></section>
          <section className={styles.eventsProofCard}>
            <div className={styles.residencyTop}>
              <span className={styles.eventsProofLabel}>{t.events.residencyLabel}</span>
              <div className={styles.eventsMentors}><strong>{t.events.residencyMentors.value}</strong><span>{t.events.residencyMentors.label}</span></div>
            </div>
            <div className={styles.eventsResults}>{t.events.residencyResults.map((result) => <div key={result.value}><strong>{result.value}</strong><span>{result.label}</span></div>)}</div>
          </section>
        </div>
        <div className={styles.eventsNetwork}><strong>{t.events.partnerLabel}</strong><ul className={styles.partnerLogos} aria-label={t.events.partnerLabel}>{partners.map((partner) => <li key={partner.name}><Image src={partner.src} width={partner.width} height={partner.height} alt={partner.name} /></li>)}</ul></div>
        <div className={styles.communityGallery}>
          {t.events.gallery.map((photo) => (
            <div className={styles.communityPhoto} key={photo.src}>
              <Image src={photo.src} alt={photo.alt} fill sizes="(max-width: 640px) 50vw, 25vw" />
            </div>
          ))}
        </div>
      </>;
    case 9:
      return <>
        <SlideHead number="10" category={t.space.category} title={t.space.title} />
        <p className={styles.spaceLead}>{t.space.statement}</p>
        <div className={styles.spaceGallery}>{t.space.images.map((item) => <figure key={item.src}>
          <div className={styles.spacePhoto}><Image src={item.src} alt={item.alt} fill sizes="(max-width: 640px) 100vw, 33vw" unoptimized /></div>
          <figcaption>{item.caption}</figcaption>
        </figure>)}</div>
        <p className={styles.spaceNote}>{t.space.note}</p>
      </>;
    case 10:
      return <>
        <SlideHead number="11" category={t.budget.category} title={t.budget.title} />
        <p className={styles.budgetIntro}>{t.budget.intro}</p>
        <ul className={styles.budgetList}>{t.budget.areas.map((area) => <li key={area.title}><strong>{area.title}</strong><span>{area.body}</span></li>)}</ul>
        <p className={styles.note}>{t.budget.note}</p>
      </>;
    case 11:
      return <>
        <SlideHead number="12" category={t.plan.category} title={t.plan.title} />
        <div className={styles.planTracks}>
          <section className={styles.planTrack} aria-label={t.plan.school.label}>
            <strong className={styles.planTrackLabel}>{t.plan.school.label}</strong>
            <div className={styles.schoolFormats}>{[t.plan.school.inPerson, t.plan.school.online].map((format) => <div className={styles.schoolFormat} key={format.label}>
              <strong className={styles.schoolFormatLabel}>{format.label}</strong>
              <div className={styles.schoolFormatMetric}><strong>{format.value}</strong><span>{format.unit}</span></div>
              <p>{format.detail}</p>
            </div>)}</div>
          </section>
          <section className={styles.planTrack} aria-label={t.plan.hub.label}>
            <strong className={styles.planTrackLabel}>{t.plan.hub.label}</strong>
            <div className={styles.planMetrics}>{t.plan.hub.metrics.map((metric) => <div key={metric.label}><strong>{metric.value}</strong><span>{metric.label}</span></div>)}</div>
            <p>{t.plan.hub.note}</p>
          </section>
        </div>
        <div className={styles.planMilestones}>{t.plan.milestones.map((milestone) => <div key={milestone.date}><strong>{milestone.date}</strong><span>{milestone.label}</span></div>)}</div>
        <p className={styles.planNote}>{t.plan.note}</p>
      </>;
    case 12:
      return <>
        <div className={styles.coverGradient} aria-hidden="true">
          <AnimatedGradient
            variant="mist"
            speed={0.35}
            opacity={1}
            className={styles.coverGradientCanvas}
          />
          <div className={styles.coverGradientVeil} />
        </div>
        <div className={styles.endCopy}>
          <p className={`${styles.eyebrow} ${styles.coverEyebrow}`}>
            <span className={styles.coverEyebrowLogo} role="img" aria-label="Iquiti" />
            <span aria-hidden="true">·</span>
            <span>{t.close.eyebrow}</span>
          </p>
          <h2>{t.close.title} <em>{t.close.emphasis}</em></h2>
          <p className={styles.lead}>{t.close.lead}</p>
        </div>
        <BrandGraphic />
      </>;
    default:
      return null;
  }
}

function BrandGraphic() {
  return <div className={styles.coverGraphic} aria-hidden="true"><Image src="/brand/iquiti/logo-graphic.svg" width={492} height={494} alt="" /></div>;
}

function SlideHead({ number, category, title }: { number: string; category: string; title: string }) {
  return <div className={styles.slideHead}><p className={styles.eyebrow}>{number} / {category}</p><h2>{title}</h2></div>;
}

function PillarHead({ number, labels, navLabel, title, goTo }: { number: number; labels: readonly { title: string }[]; navLabel: string; title: string; goTo: (next: number) => void }) {
  return <div className={styles.slideHead}>
    <nav className={styles.pillarRail} aria-label={navLabel}>{labels.map((pillar, i) => <button key={pillar.title} type="button" className={number === i + 1 ? styles.pillarRailActive : ""} aria-current={number === i + 1 ? "step" : undefined} onClick={() => goTo(firstPillarSlide + i)}><span>{String(i + 1).padStart(2, "0")}</span><strong>{pillar.title}</strong></button>)}</nav>
    <h2>{title}</h2>
  </div>;
}

function Statement({ number, title, body }: { number: string; title: string; body: string }) {
  return <div className={styles.statement}><span>{number}</span><h3>{title}</h3><p>{body}</p></div>;
}
