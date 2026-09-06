"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useId, useState } from "react";
import { BookOpen } from "./icons";

export function ProgramNavigation({ weeks }: { weeks: { week: number; title: string }[] }) {
  const pathname = usePathname();
  const id = useId();
  const [disclosure, setDisclosure] = useState<{ pathname: string; expanded: boolean } | null>(null);
  const currentWeek = Number(pathname.match(/^\/programa\/semana\/(\d+)(?:\/|$)/)?.[1]
    ?? pathname.match(/^\/proyectos\/(\d+)\/entrega/)?.[1]);
  const inProgram = pathname === "/programa" || pathname.startsWith("/programa/") || Boolean(currentWeek);
  const expanded = disclosure?.pathname === pathname ? disclosure.expanded : inProgram;

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
        <li><Link aria-current={pathname === "/programa/biblioteca" ? "page" : undefined} href="/programa/biblioteca">Biblioteca completa de Odin</Link></li>
        {weeks.map(({ week, title }) => (
          <li key={week}>
            <Link
              aria-current={currentWeek === week ? "location" : undefined}
              aria-label={`Semana ${week}: ${title}`}
              href={`/programa/semana/${week}`}
              title={title}
            >
              <span className="program-navigation__number">{String(week).padStart(2, "0")}</span>
              <span className="program-navigation__label"><span>Semana {week}</span><small>{title}</small></span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
