"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useId, useState } from "react";
import { createPortal } from "react-dom";
import { CircleCheck, Clock3, BookOpen } from "lucide-react";

export function ProgramNavigation({ weeks }: { weeks: { week: number; title: string; completed?: boolean }[] }) {
  const pathname = usePathname();
  const id = useId();
  const [disclosure, setDisclosure] = useState<{ pathname: string; expanded: boolean } | null>(null);
  const [tooltip, setTooltip] = useState<{ left: number; text: string; top: number } | null>(null);
  const currentWeek = Number(pathname.match(/^\/programa\/semana\/(\d+)(?:\/|$)/)?.[1]
    ?? pathname.match(/^\/proyectos\/(\d+)\/entrega/)?.[1]);
  const inProgram = pathname === "/programa" || pathname.startsWith("/programa/") || Boolean(currentWeek);
  const expanded = disclosure?.pathname === pathname ? disclosure.expanded : inProgram;
  function showTooltip(target: HTMLElement, text: string) {
    const { right, top, height } = target.getBoundingClientRect();
    setTooltip({ left: right + 10, text, top: top + (height / 2) });
  }

  return (
    <div className="program-navigation">
      <button
        aria-controls={id}
        aria-expanded={expanded}
        className={`program-navigation__toggle${inProgram ? " is-active" : ""}`}
        onClick={() => setDisclosure({ pathname, expanded: !expanded })}
        type="button"
      >
        <BookOpen /><span>Mi programa</span>
        <svg aria-hidden="true" className="program-navigation__chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="m6 9 6 6 6-6" /></svg>
      </button>
      <ul className="program-navigation__weeks" id={id} hidden={!expanded}>
        <li><Link aria-current={pathname === "/programa" ? "page" : undefined} href="/programa">Ver programa completo</Link></li>
        {weeks.map(({ week, title, completed = false }) => (
          <li key={week}>
            <Link
              aria-current={currentWeek === week ? "location" : undefined}
              aria-label={`Semana ${week}: ${title}`}
              href={`/programa/semana/${week}`}
              onBlur={() => setTooltip(null)}
              onFocus={(event) => showTooltip(event.currentTarget, title)}
              onMouseEnter={(event) => showTooltip(event.currentTarget, title)}
              onMouseLeave={() => setTooltip(null)}
            >
              <span className="program-navigation__number">{String(week).padStart(2, "0")}</span>
              <span className="program-navigation__label"><span className="program-navigation__week-heading"><span className="program-navigation__week-title">Semana {week}</span>{completed ? <CircleCheck aria-hidden="true" className="program-navigation__status program-navigation__status--completed" size={15} strokeWidth={1.8} /> : <Clock3 aria-hidden="true" className="program-navigation__status" size={15} strokeWidth={1.6} />}<span className="sr-only">{completed ? "Completada" : "Pendiente"}</span></span><small>{title}</small></span>
            </Link>
          </li>
        ))}
        <li><Link aria-current={pathname === "/programa/biblioteca" ? "page" : undefined} href="/programa/biblioteca">Biblioteca completa de Odin</Link></li>
      </ul>
      {tooltip ? createPortal(<span className="program-navigation__tooltip" role="tooltip" style={{ left: tooltip.left, top: tooltip.top }}>{tooltip.text}</span>, document.body) : null}
    </div>
  );
}
