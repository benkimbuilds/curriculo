"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { deckCopy, type DeckLanguage } from "./copy";
import styles from "./presentation.module.css";

type DeckText = (typeof deckCopy)[DeckLanguage];
const slideCount = deckCopy.es.slides.length;
const amounts = ["$20k", "$15k", "$10k", "$5k"];
const shares = ["40%", "30%", "20%", "10%"];
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
        <section className={`${styles.slide} ${index === 0 || index === 12 ? styles.cover : ""}`} aria-roledescription={t.ui.slide} aria-label={`${index + 1} ${t.ui.of} ${slideCount}: ${t.slides[index].label}`} key={`${index}-${language}`}>
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
        <SlideHead number="01" category={t.reinvestment.category} title={t.reinvestment.title} />
        <div className={styles.flow}>{t.reinvestment.steps.map((step, i) => <div key={i}><span>{`0${i + 1}`}</span><strong>{step.title}</strong><small>{step.body}</small></div>)}</div>
        <p className={styles.bottomLine}>{t.reinvestment.bottom}</p>
      </>;
    case 2:
      return <>
        <SlideHead number="02" category={t.thesis.category} title={t.thesis.title} />
        <div className={styles.thesisLayout}>
          <p className={styles.bigStatement}>{t.thesis.statement}</p>
          <div className={styles.verticalRule} aria-hidden="true" />
          <div className={styles.thesisList}>{t.thesis.points.map((point) => <p key={point.title}><strong>{point.title}</strong><span>{point.body}</span></p>)}</div>
        </div>
      </>;
    case 3:
      return <>
        <SlideHead number="03" category={t.hub.category} title={t.hub.title} />
        <div className={styles.pillarGrid}>{t.hub.pillars.map((pillar, i) => <Pillar key={i} number={`0${i + 1}`} title={pillar.title} body={pillar.body} />)}</div>
      </>;
    case 4:
      return <>
        <SlideHead number="04" category={t.coworking.category} title={t.coworking.title} />
        <div className={styles.split}>
          <div className={styles.featurePanel}><span className={styles.featureNumber}>01 / 02</span><h3>{t.coworking.local.title}</h3><p>{t.coworking.local.body}</p></div>
          <div className={styles.featurePanel}><span className={styles.featureNumber}>02 / 02</span><h3>{t.coworking.global.title}</h3><p>{t.coworking.global.body}</p></div>
        </div>
        <div className={styles.partnerBand}>
          <div className={styles.partnerMessage}><strong>{t.coworking.partnerLabel}</strong><p>{t.coworking.partnerIntro}</p></div>
          <ul className={styles.partnerNames} aria-label={t.coworking.partnerLabel}>{partners.map((partner) => <li key={partner}>{partner}</li>)}</ul>
        </div>
      </>;
    case 5:
      return <>
        <SlideHead number="05" category={t.grants.category} title={t.grants.title} />
        <div className={styles.split}>
          <div className={styles.simplePanel}><span className={styles.dot} /><h3>{t.grants.local.title}</h3><p>{t.grants.local.body}</p><small>{t.grants.local.note}</small></div>
          <div className={styles.simplePanel}><span className={styles.dot} /><h3>{t.grants.events.title}</h3><p>{t.grants.events.body}</p><small>{t.grants.events.note}</small></div>
        </div>
      </>;
    case 6:
      return <>
        <SlideHead number="06" category={t.academy.category} title={t.academy.title} />
        <div className={styles.academyHero}><p>{t.academy.promise}</p><strong>{t.academy.distinction}</strong></div>
        <div className={styles.threeColumns}>{t.academy.points.map((point, i) => <Statement key={i} number={`0${i + 1}`} title={point.title} body={point.body} />)}</div>
      </>;
    case 7:
      return <>
        <SlideHead number="07" category={t.cohort.category} title={t.cohort.title} />
        <div className={styles.metricRow}>{["150", "12", "1"].map((value, i) => <div key={i}><strong>{value}</strong><span>{t.cohort.metrics[i]}</span></div>)}</div>
        <div className={styles.timeline}>{t.cohort.phases.map((phase, i) => <p key={i}><b>{`0${i + 1}`}</b><span>{phase}</span></p>)}</div>
        <p className={styles.bottomLine}>{t.cohort.bottom}</p>
      </>;
    case 8:
      return <>
        <SlideHead number="08" category={t.cycle.category} title={t.cycle.title} />
        <div className={styles.flow}>{t.cycle.steps.map((step, i) => <div key={i}><span>{`0${i + 1}`}</span><strong>{step.title}</strong><small>{step.body}</small></div>)}</div>
        <p className={styles.bottomLine}>{t.cycle.bottom}</p>
      </>;
    case 9:
      return <>
        <SlideHead number="09" category={t.space.category} title={t.space.title} />
        <div className={styles.spaceLayout}>
          <div className={styles.spaceImage} role="img" aria-label={t.space.imageAlt} />
          <div className={styles.spaceCopy}><p className={styles.bigStatement}>{t.space.statement}</p><ul>{t.space.features.map((feature) => <li key={feature}>{feature}</li>)}</ul><small>{t.space.note}</small></div>
        </div>
      </>;
    case 10:
      return <>
        <SlideHead number="10" category={t.budget.category} title={t.budget.title} />
        <p className={styles.budgetIntro}>{t.budget.intro}</p>
        <div className={styles.budgetList}>{t.budget.areas.map((area, i) => <div key={i}><span>{area}</span><strong>{amounts[i]}</strong><small>{shares[i]}</small></div>)}</div>
        <p className={styles.note}>{t.budget.note}</p>
      </>;
    case 11:
      return <>
        <SlideHead number="11" category={t.plan.category} title={t.plan.title} />
        <div className={styles.plan}>{t.plan.milestones.map((milestone, i) => <div key={i}><span>{milestone.date}</span><strong>{milestone.title}</strong><p>{milestone.body}</p></div>)}</div>
        <p className={styles.note}>{t.plan.note}</p>
      </>;
    case 12:
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

function Statement({ number, title, body }: { number: string; title: string; body: string }) {
  return <div className={styles.statement}><span>{number}</span><h3>{title}</h3><p>{body}</p></div>;
}

function Pillar({ number, title, body }: { number: string; title: string; body: string }) {
  return <div className={styles.pillar}><span>{number}</span><h3>{title}</h3><p>{body}</p></div>;
}
