import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRight, Check, Clock } from "./icons";

export function PageIntro({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <header className="page-intro">
      <div>
        {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
        <h1>{title}</h1>
        {description ? <p className="lede">{description}</p> : null}
      </div>
      {action ? <div className="page-intro__action">{action}</div> : null}
    </header>
  );
}

export function ProgressBar({ value, label }: { value: number; label?: string }) {
  return (
    <div className="progress" aria-label={label ?? `${value}% completado`}>
      <div className="progress__track"><span style={{ width: `${Math.max(0, Math.min(value, 100))}%` }} /></div>
      {label ? <span className="progress__label">{label}</span> : null}
    </div>
  );
}

export function StatusPill({ children, tone = "neutral" }: { children: ReactNode; tone?: "neutral" | "good" | "warm" | "alert" | "info" }) {
  return <span className={`status status--${tone}`}>{children}</span>;
}

export function LessonRow({
  href,
  title,
  meta,
  status = "upcoming",
}: {
  href: string;
  title: string;
  meta: string;
  status?: "done" | "current" | "upcoming";
}) {
  return (
    <Link className={`lesson-row lesson-row--${status}`} href={href}>
      <span className="lesson-row__state">{status === "done" ? <Check /> : status === "current" ? <span /> : null}</span>
      <span className="lesson-row__body"><strong>{title}</strong><small><Clock /> {meta}</small></span>
      <ArrowRight className="lesson-row__arrow" />
    </Link>
  );
}

export function Avatar({ name, color = "clay", size = "md" }: { name: string; color?: "clay" | "blue" | "green" | "yellow" | "violet"; size?: "sm" | "md" | "lg" }) {
  const initials = name.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase();
  return <span aria-label={name} className={`avatar avatar--${color} avatar--${size}`} title={name}>{initials}</span>;
}

export function Metric({ label, value, detail }: { label: string; value: string; detail?: string }) {
  return (
    <article className="metric-card">
      <p>{label}</p>
      <strong>{value}</strong>
      {detail ? <small>{detail}</small> : null}
    </article>
  );
}

export function EmptyState({ icon, title, body, href, action }: { icon: ReactNode; title: string; body: string; href?: string; action?: string }) {
  return (
    <div className="empty-state">
      <span className="empty-state__icon">{icon}</span>
      <h3>{title}</h3>
      <p>{body}</p>
      {href && action ? <Link className="text-link" href={href}>{action} <ArrowRight /></Link> : null}
    </div>
  );
}
