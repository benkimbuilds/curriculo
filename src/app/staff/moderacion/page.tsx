import Link from "next/link";
import { redirect } from "next/navigation";

import { AppShell } from "@/components/app-shell";
import { ExternalLink, Shield, Warning } from "@/components/icons";
import { Avatar, Metric, PageIntro, StatusPill } from "@/components/ui";
import { getCurrentSession } from "@/modules/auth/session";
import { moderateReportAction } from "@/modules/community/db-actions";
import { listModerationQueue } from "@/modules/community/db-community";

const reasonLabels: Record<string, string> = { harassment: "Acoso", hate_or_discrimination: "Odio o discriminación", sexual_content: "Contenido sexual", personal_information: "Datos personales", spam: "Spam", copyright: "Derechos de autor", other_safety_concern: "Otro riesgo de seguridad" };

export default async function ModerationPage() {
  const session = await getCurrentSession();
  if (!session) redirect("/iniciar-sesion");
  const reports = await listModerationQueue(session.user.id);
  const reviewing = reports.filter(({ status }) => status === "under_review").length;
  return (
    <AppShell role="staff" userName={session.user.name}><div className="app-content"><PageIntro description="Revisa reportes con contexto. Cada decisión queda registrada." eyebrow="Seguridad de la comunidad" title="Cola de moderación" />
      <div className="metrics-grid"><Metric label="Reportes abiertos" value={String(reports.length)} /><Metric label="En revisión" value={String(reviewing)} /><Metric label="Objetivos ocultos" value="—" /><Metric label="Mensajes directos" value="0" /></div>
      <div className="moderation-list">{reports.map((report) => { const action = moderateReportAction.bind(null, report.id); return <article className="panel moderation-card" key={report.id}><div className="moderation-card__top"><StatusPill tone="warm"><Warning /> {report.status === "under_review" ? "En revisión" : "Abierto"}</StatusPill><span>{report.createdAt.toLocaleString("es-MX")}</span></div><div className="moderation-card__subject"><Avatar color="clay" name={report.author} /><div><small>PROYECTO REPORTADO</small><h2>{report.projectTitle}</h2><p>por {report.author}</p></div></div><dl><div><dt>Motivo</dt><dd>{reasonLabels[report.reason] ?? report.reason}</dd></div><div><dt>Contexto</dt><dd>Entrega aprobada en la galería</dd></div></dl><form action={action} className="moderation-card__actions"><button className="button button--danger" name="decision" type="submit" value="hide">Ocultar proyecto</button><button className="button button--ghost" name="decision" type="submit" value="dismiss">No infringe las reglas</button><Link className="text-link" href={`/galeria/${report.targetId}`}>Ver proyecto <ExternalLink /></Link></form></article>; })}</div>
      {!reports.length ? <section className="panel"><h2>No hay reportes pendientes</h2><p>La cola está al día.</p></section> : null}<aside className="moderation-note"><Shield /><p><strong>Recuerda:</strong> ocultar contenido no elimina la cuenta. Los casos graves deben escalarse a administración.</p></aside>
    </div></AppShell>
  );
}
