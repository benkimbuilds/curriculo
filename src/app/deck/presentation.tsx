"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { deckCopy, type DeckLanguage } from "./copy";
import styles from "./presentation.module.css";

type DeckText = (typeof deckCopy)[DeckLanguage];
const slideCount = deckCopy.es.slides.length;
const partners = ["OpenAI", "Cursor", "SpaceX", "Vercel", "Google", "NVIDIA"];

export default function Deck() {
  const [index, setIndex] = useState(0);
  const [overview, setOverview] = useState(false);
  const [language, setLanguage] = useState<DeckLanguage>("es");
  const t = deckCopy[language];
  const goTo = useCallback((next: number) => {
    setIndex(Math.max(0, Math.min(slideCount - 1, next)));
    setOverview(false);
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.altKey || event.ctrlKey || event.metaKey) return;
      if (event.key === " " && event.target instanceof HTMLElement && event.target.closest("button")) return;
      if (["ArrowRight", "ArrowDown", "PageDown", " "].includes(event.key)) {
        event.preventDefault();
        setIndex((current) => Math.min(slideCount - 1, current + 1));
        setOverview(false);
      } else if (["ArrowLeft", "ArrowUp", "PageUp"].includes(event.key)) {
        event.preventDefault();
        setIndex((current) => Math.max(0, current - 1));
        setOverview(false);
      } else if (event.key === "Home") {
        event.preventDefault();
        goTo(0);
      } else if (event.key === "End") {
        event.preventDefault();
        goTo(slideCount - 1);
      } else if (event.key.toLowerCase() === "o") {
        setOverview((current) => !current);
      } else if (event.key === "Escape") {
        setOverview(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [goTo]);

  return (
    <main data-iquiti-home lang={language === "es" ? "es-MX" : "en"} className={styles.deck} aria-label={t.ui.deck}>
      <header className={styles.chrome}>
        <div className={styles.brand} aria-label="Iquiti">
          <Image src="/brand/iquiti/logotipo-Iquiti.svg" width={800} height={296} alt="Iquiti" priority />
          <span>[ CI — AT ]</span>
        </div>
        <div className={styles.chromeRight}>
          <span className={styles.deckName}>{t.ui.location}</span>
          <button type="button" className={styles.languageButton} onClick={() => setLanguage(language === "es" ? "en" : "es")} aria-label={t.ui.language}>
            <strong>{language.toUpperCase()}</strong><span aria-hidden="true">↔</span><span>{language === "es" ? "EN" : "ES"}</span>
          </button>
          <button type="button" className={styles.overviewButton} onClick={() => setOverview((current) => !current)} aria-expanded={overview} aria-label={t.ui.overviewAria}>{t.ui.overview}</button>
        </div>
      </header>

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
        <section className={`${styles.slide} ${index === 0 || index === 13 ? styles.cover : ""}`} aria-roledescription={t.ui.slide} aria-label={`${index + 1} ${t.ui.of} ${slideCount}: ${t.slides[index].label}`} key={`${index}-${language}`}>
          <SlideContent index={index} t={t} />
        </section>
      )}

      <footer className={styles.controls}>
        <div className={styles.progress}><span>{String(index + 1).padStart(2, "0")} / {String(slideCount).padStart(2, "0")}</span><div aria-hidden="true"><i style={{ width: `${((index + 1) / slideCount) * 100}%` }} /></div><span>{t.slides[index].label}</span></div>
        <div className={styles.navigation}><button type="button" onClick={() => goTo(index - 1)} disabled={index === 0} aria-label={t.ui.previous}>←</button><button type="button" onClick={() => goTo(index + 1)} disabled={index === slideCount - 1} aria-label={t.ui.next}>→</button></div>
      </footer>
      <span className={styles.srOnly} aria-live="polite">{t.ui.slide} {index + 1} {t.ui.of} {slideCount}: {t.slides[index].label}</span>
    </main>
  );
}

function SlideContent({ index, t }: { index: number; t: DeckText }) {
  switch (index) {
    case 0:
      return <>
        <div className={styles.coverCopy}>
          <p className={styles.eyebrow}>{t.cover.eyebrow}</p>
          <h1>{t.cover.title} <em>{t.cover.emphasis}</em></h1>
          <p className={styles.lead}>{t.cover.lead}</p>
        </div>
        <BrandGraphic />
      </>;
    case 1:
      return <>
        <SlideHead number="02" category={t.problem.category} title={t.problem.title} />
        <div className={styles.threeColumns}>{t.problem.points.map((point, i) => <Statement key={i} number={`0${i + 1}`} title={point.title} body={point.body} />)}</div>
        <p className={styles.bottomLine}>{t.problem.bottom}</p>
      </>;
    case 2:
      return <>
        <SlideHead number="03" category={t.reinvestment.category} title={t.reinvestment.title} />
        <div className={styles.flow}>{t.reinvestment.steps.map((step, i) => <div key={i}><span>{`0${i + 1}`}</span><strong>{step.title}</strong><small>{step.body}</small></div>)}</div>
        <p className={styles.bottomLine}>{t.reinvestment.bottom}</p>
      </>;
    case 3:
      return <>
        <SlideHead number="04" category={t.thesis.category} title={t.thesis.title} />
        <div className={styles.thesisLayout}>
          <p className={styles.bigStatement}>{t.thesis.statement}</p>
          <div className={styles.verticalRule} aria-hidden="true" />
          <div className={styles.thesisList}>{t.thesis.points.map((point) => <p key={point.title}><strong>{point.title}</strong><span>{point.body}</span></p>)}</div>
        </div>
      </>;
    case 4:
      return <>
        <SlideHead number="05" category={t.hub.category} title={t.hub.title} />
        <div className={styles.pillarGrid}>{t.hub.pillars.map((pillar, i) => <Pillar key={i} number={`0${i + 1}`} title={pillar.title} body={pillar.body} />)}</div>
      </>;
    case 5:
      return <>
        <PillarHead number={1} category={t.hub.pillars[0].title} title={t.academy.title} />
        <div className={styles.academyHero}><p>{t.academy.promise}</p><strong>{t.academy.distinction}</strong></div>
        <div className={styles.threeColumns}>{t.academy.points.map((point, i) => <Statement key={i} number={`0${i + 1}`} title={point.title} body={point.body} />)}</div>
        <p className={styles.bottomLine}>{t.academy.bottom}</p>
      </>;
    case 6:
      return <>
        <PillarHead number={2} category={t.hub.pillars[1].title} title={t.coworking.title} />
        <div className={styles.split}>
          <div className={styles.featurePanel}><span className={styles.featureNumber}>01 / 02</span><h3>{t.coworking.entry.title}</h3><p>{t.coworking.entry.body}</p></div>
          <div className={styles.featurePanel}><span className={styles.featureNumber}>02 / 02</span><h3>{t.coworking.next.title}</h3><p>{t.coworking.next.body}</p></div>
        </div>
        <p className={styles.bottomLine}>{t.coworking.bottom}</p>
      </>;
    case 7:
      return <>
        <PillarHead number={3} category={t.hub.pillars[2].title} title={t.grants.title} />
        <div className={styles.split}>
          <div className={styles.simplePanel}><span className={styles.dot} /><h3>{t.grants.need.title}</h3><p>{t.grants.need.body}</p><small>{t.grants.need.note}</small></div>
          <div className={styles.simplePanel}><span className={styles.dot} /><h3>{t.grants.teams.title}</h3><p>{t.grants.teams.body}</p><small>{t.grants.teams.note}</small></div>
        </div>
        <p className={styles.bottomLine}>{t.grants.bottom}</p>
      </>;
    case 8:
      return <>
        <PillarHead number={4} category={t.hub.pillars[3].title} title={t.residencies.title} />
        <div className={styles.split}>
          <div className={styles.featurePanel}><span className={styles.featureNumber}>01 / 02</span><h3>{t.residencies.invited.title}</h3><p>{t.residencies.invited.body}</p></div>
          <div className={styles.featurePanel}><span className={styles.featureNumber}>02 / 02</span><h3>{t.residencies.exchange.title}</h3><p>{t.residencies.exchange.body}</p></div>
        </div>
        <p className={styles.bottomLine}>{t.residencies.bottom}</p>
      </>;
    case 9:
      return <>
        <PillarHead number={5} category={t.hub.pillars[4].title} title={t.events.title} />
        <div className={styles.eventsLayout}>
          <div className={styles.eventsMetric}><strong>5,000</strong><span>{t.events.community}</span><p>{t.events.cadence}</p></div>
          <div className={styles.eventsPartners}><strong>{t.events.partnerLabel}</strong><ul className={styles.partnerNames} aria-label={t.events.partnerLabel}>{partners.map((partner) => <li key={partner}>{partner}</li>)}</ul></div>
        </div>
        <p className={styles.eventsNote}>{t.events.partnerIntro}</p>
      </>;
    case 10:
      return <>
        <SlideHead number="11" category={t.space.category} title={t.space.title} />
        <p className={styles.spaceLead}>{t.space.statement}</p>
        <div className={styles.spaceGallery}>{t.space.images.map((item) => <figure key={item.src}>
          <div className={styles.spacePhoto}><Image src={item.src} alt={item.alt} fill sizes="(max-width: 640px) 100vw, 33vw" unoptimized /></div>
          <figcaption>{item.caption}</figcaption>
        </figure>)}</div>
        <p className={styles.spaceNote}>{t.space.note}</p>
      </>;
    case 11:
      return <>
        <SlideHead number="12" category={t.budget.category} title={t.budget.title} />
        <p className={styles.budgetIntro}>{t.budget.intro}</p>
        <ul className={styles.budgetList}>{t.budget.areas.map((area) => <li key={area}>{area}</li>)}</ul>
        <p className={styles.note}>{t.budget.note}</p>
      </>;
    case 12:
      return <>
        <SlideHead number="13" category={t.plan.category} title={t.plan.title} />
        <div className={styles.planTracks}>
          {[t.plan.school, t.plan.hub].map((track) => <section className={styles.planTrack} key={track.label} aria-label={track.label}>
            <strong className={styles.planTrackLabel}>{track.label}</strong>
            <div className={styles.planMetrics}>{track.metrics.map((metric) => <div key={metric.label}><strong>{metric.value}</strong><span>{metric.label}</span></div>)}</div>
            <p>{track.note}</p>
          </section>)}
        </div>
        <div className={styles.planMilestones}>{t.plan.milestones.map((milestone) => <div key={milestone.date}><strong>{milestone.date}</strong><span>{milestone.label}</span></div>)}</div>
        <p className={styles.planNote}>{t.plan.note}</p>
      </>;
    case 13:
      return <>
        <div className={styles.endCopy}>
          <p className={styles.eyebrow}>{t.close.eyebrow}</p>
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

function PillarHead({ number, category, title }: { number: number; category: string; title: string }) {
  return <div className={styles.slideHead}><p className={styles.eyebrow}>{String(number).padStart(2, "0")} / 05 · {category}</p><h2>{title}</h2></div>;
}

function Statement({ number, title, body }: { number: string; title: string; body: string }) {
  return <div className={styles.statement}><span>{number}</span><h3>{title}</h3><p>{body}</p></div>;
}

function Pillar({ number, title, body }: { number: string; title: string; body: string }) {
  return <div className={styles.pillar}><span>{number}</span><h3>{title}</h3><p>{body}</p></div>;
}
