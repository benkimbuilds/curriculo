import { redirect } from "next/navigation";
import Link from "next/link";

import { AppShell } from "@/components/app-shell";
import { Check, Warning } from "@/components/icons";
import { PageIntro, ProgressBar, StatusPill } from "@/components/ui";
import { getCurrentSession } from "@/modules/auth/session";
import { requirePermission } from "@/modules/authorization/service";
import { resolveDefaultOrganizationId } from "@/modules/community/db-community";
import { listCurriculumWeeks } from "@/modules/curriculum";

export default async function CurriculumAdminPage({ searchParams }: { searchParams: Promise<{ idioma?: string }> }) {
  const session = await getCurrentSession();
  if (!session) redirect("/iniciar-sesion");
  const organizationId = await resolveDefaultOrganizationId();
  await requirePermission(session.user.id, organizationId, "curriculum:audit");
  const query = await searchParams;
  const showEnglish = query.idioma === "en";
  const spanish = listCurriculumWeeks({ locale: "es-MX", includeUnpublished: true });
  const english = listCurriculumWeeks({ locale: "en", includeUnpublished: true });
  const englishById = new Map(english.map((week) => [week.id, week]));
  const published = spanish.filter(({ status }) => status === "published").length;
  const parity = spanish.filter((week) => englishById.has(week.id)).length;
  const provenance = spanish.filter((week) => week.provenance.upstreamCommit && week.provenance.upstreamPaths.length).length;
  return (
    <AppShell role="admin" userName={session.user.name}><div className="app-content"><PageIntro description="Estado editorial y procedencia del currículo versionado." eyebrow="Administración de currículo" title="Control editorial" />
      <section className="panel"><h2>Inventario completo de Odin</h2><p>Consulta cada lección y proyecto de origen, su adaptación en español y la edición de auditoría en inglés. La publicación del material no implica una revisión pedagógica humana independiente.</p><Link className="button button--ghost" href="/admin/curriculo/cobertura">Auditar cobertura por lección</Link></section>
      <form className="admin-language-gate" method="get"><Warning /><div><strong>Fuente de auditoría en inglés</strong><p>Esta comparación está limitada a roles de currículo y desarrollo.</p></div><label className="switch"><input defaultChecked={showEnglish} name="idioma" type="checkbox" value="en" /><span /> Mostrar inglés</label><button className="button button--ghost" type="submit">Aplicar</button></form>
      <div className="metrics-grid"><div className="metric-card"><p>Semanas publicadas</p><strong>{published} / {spanish.length}</strong><ProgressBar value={spanish.length ? (published / spanish.length) * 100 : 0} /></div><div className="metric-card"><p>Paridad de idiomas</p><strong>{parity} / {spanish.length}</strong><small>IDs estables emparejados</small></div><div className="metric-card"><p>Procedencia completa</p><strong>{provenance} / {spanish.length}</strong><small>Commit y rutas fuente</small></div><div className="metric-card"><p>Edición</p><strong>Vigente</strong><small>Fuente generada</small></div></div>
      <section className="panel editorial-table"><div className="panel__header"><div><p className="eyebrow">Programa completo</p><h2>Doce semanas</h2></div><StatusPill tone="info">Vigente</StatusPill></div><div className="content-table"><div className="content-table__head"><span>ID</span><span>Semana</span><span>Estado</span><span>Inglés</span><span>Fuente</span><span /></div>{spanish.map((week) => { const paired = englishById.get(week.id); return <div className="content-table__row" key={week.id}><code>{week.id}</code><strong>{week.title}{showEnglish && paired ? <small>{paired.title}</small> : null}</strong><StatusPill tone={week.status === "published" ? "good" : week.status === "review" ? "warm" : "neutral"}>{week.status}</StatusPill><span className={paired ? "locale-ok" : "locale-pending"}>{paired ? <Check /> : <Warning />}{paired ? "Completo" : "Pendiente"}</span><span className="locale-ok"><Check /> Sí</span><span>{week.modules.flatMap(({ lessons }) => lessons).length} lecciones</span></div>; })}</div></section>
    </div></AppShell>
  );
}
